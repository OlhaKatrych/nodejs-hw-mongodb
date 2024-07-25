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
