import path from 'node:path';
import fs from 'node:fs/promises';

import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import randomBytes from 'randombytes';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';

import { User } from '../db/models/users.js';
import { Session } from '../db/models/session.js';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/index.js';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import { TEMPLATES_DIR } from '../constants/index.js';

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({ ...payload, password: encryptedPassword });
}

export async function requestResetToken(email) {
  const user = await User.findOne({ email });
  if (user === null) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = await fs.readFile(resetPasswordTemplatePath, {
    encoding: 'utf-8',
  });
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  const sendingEmail = await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });

  if (!sendingEmail) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
}

export async function resetPassword(payload) {
  let entries;
  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError(401, 'Token is expired or invalid');
    }
  }
  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (user === null) {
    throw createHttpError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
  await Session.deleteOne({ userId: user._id });
}

function createSession() {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  };
}

export async function loginUser(payload) {
  const user = await User.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found');
  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) throw createHttpError(401, 'Unauthorized');
  await Session.deleteOne({ userId: user._id });
  const newSession = createSession();
  return await Session.create({
    userId: user._id,
    ...newSession,
  });
}

export async function refreshUsersSession({ sessionId, refreshToken }) {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();
  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
}

export async function logoutUser({ sessionId, refreshToken }) {
  await Session.deleteOne({ _id: sessionId, refreshToken });
}
