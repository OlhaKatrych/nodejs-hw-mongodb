import express from 'express';

import {
  getAllContactsContoller,
  getContactByIdController,
  createContactController,
  changeContactNameController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getAllContactsContoller));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', jsonParser, ctrlWrapper(createContactController));
router.patch(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(changeContactNameController),
);
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
