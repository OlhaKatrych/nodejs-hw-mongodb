import { contacts } from '../db/models/contacts.js';

export async function getAllContacts() {
  const contactsAll = await contacts.find();
  return contactsAll;
}

export async function getContactById(contactId) {
  const contactById = await contacts.findById(contactId);
  return contactById;
}

export async function createContact(payload) {
  const newContact = await contacts.create(payload);
  return newContact;
}

export async function changeContactName(contactId, contact, options = {}) {
  const changeContact = await contacts.findOneAndUpdate(
    { _id: contactId },
    contact,
    { new: true },
  );
  return changeContact;
}

export async function deleteContact(contactId) {
  const contact = await contacts.findOneAndDelete({ _id: contactId });
  return contact;
}
