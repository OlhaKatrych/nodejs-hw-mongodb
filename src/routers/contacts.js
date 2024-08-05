import express from 'express';

import {
  getAllContactsContoller,
  getContactByIdController,
  createContactController,
  changeContactNameController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getAllContactsContoller));
router.get('/contacts/:contactId',isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/contacts',
  jsonParser,
  await validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/contacts/:contactId',
  isValidId,
  jsonParser,
  await validateBody(updateContactSchema),
  ctrlWrapper(changeContactNameController),
);
router.delete('/contacts/:contactId',isValidId, ctrlWrapper(deleteContactController));

export default router;
