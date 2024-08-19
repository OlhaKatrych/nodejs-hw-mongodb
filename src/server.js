import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import { env } from '../src/utils/env.js';
import router from './routers/index.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { notFoundHandler } from '../src/middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = Number(env('PORT', 8080));

export function setupServer() {
  const app = express();
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
