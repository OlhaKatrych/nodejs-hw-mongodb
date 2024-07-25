import express from 'express';

import {
  getAllContactsContoller,
  getContactByIdController,
} from '../controllers/contacts.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/contacts', getAllContactsContoller);
router.get('/contacts/:contactId', getContactByIdController);

export default router;
