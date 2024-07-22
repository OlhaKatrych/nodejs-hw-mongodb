import { contacts } from '../db/models/contacts.js';

export async function getAllContacts() {
  const contactsAll = await contacts.find();
  console.log(contactsAll);
  return contactsAll;
}

export async function getContactById(contactId) {
    const contactById = await contacts.findById(contactId);
    console.log(contactById);
    return contactById;
  }
