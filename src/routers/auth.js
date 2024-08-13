import express from 'express';
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
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
  '/login',
  jsonParser,
  await validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

export default router;
