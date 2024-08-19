import express from 'express';
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
  logoutUserController,
  requestResetEmailController,
  resetPasswordController
} from '../controllers/auth.js';

const router = Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  await validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/send-reset-email',
  jsonParser,
  await validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  jsonParser,
  await validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.post(
  '/login',
  jsonParser,
  await validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserSessionController));
export default router;

router.post('/logout', ctrlWrapper(logoutUserController));
