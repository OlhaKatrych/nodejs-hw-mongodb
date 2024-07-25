import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  createContact,
  changeContactName,
  deleteContact,
} from '../services/contacts.js';

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
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({ data: contactById });
}

export async function createContactController(req, res) {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  const newContact = await createContact(contact);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: newContact,
  });
}

export async function changeContactNameController(req, res, next) {
  const { contactId } = req.params;
  const newName = req.body.name;
  const changeContact = await changeContactName(contactId, newName);
  if (changeContact === null) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: changeContact,
  });
}

export async function deleteContactController(req, res, next) {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);
  if (contact === null) {
    return next(createHttpError(404, `Contact is not found`));
  }
  res.status(204).send();
}
