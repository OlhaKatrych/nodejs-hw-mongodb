import express from 'express';

import {
  getAllContactsContoller,
  getContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getAllContactsContoller));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

export default router;
