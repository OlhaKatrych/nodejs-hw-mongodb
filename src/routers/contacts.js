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
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

const jsonParser = express.json();

router.use(authenticate);
router.get('/', ctrlWrapper(getAllContactsContoller));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/',
  jsonParser,
  upload.single('photo'),
  await validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  isValidId,
  jsonParser,
  upload.single('photo'),
  await validateBody(updateContactSchema),
  ctrlWrapper(changeContactNameController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
