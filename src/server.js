import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { env } from '../src/utils/env.js';
import { getAllContacts, getContactById } from '../src/services/contacts.js';

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

  app.get('/contacts', async (req, res) => {
    try {
      const contactsAll = await getAllContacts();
      res
        .status(200)
        .send({ message: 'Successfully found contacts!', data: contactsAll });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contactById = await getContactById(contactId);
      if (contactById === null) {
        return res.status(404).send({
          message: 'Contact not found',
        });
      }
      res.status(200).send({
        status: 200,
        message: `Successfully found contact with id ${contactId}`,
        data: contactById,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
