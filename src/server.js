import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { env } from '../src/utils/env.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { notFoundHandler } from '../src/middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', 8080));

export function setupServer() {
  const app = express();
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
