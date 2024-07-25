import createHttpError from 'http-errors';

import { getAllContacts, getContactById } from '../services/contacts.js';

export async function getAllContactsContoller(req, res) {
  const contactsAll = await getAllContacts();
  res.status(200).send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsAll,
  });
}

export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;
  const contactById = await getContactById(contactId);
  if (contactById === null) {
    return next(createHttpError(404, 'Student is not found'));
  }
  res.status(200).json({ data: contactById });
}
