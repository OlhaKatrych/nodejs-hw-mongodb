import { contacts } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const contactsQuery = contacts.find();
  const [contactsCount, contactsAll] = await Promise.all([
    contacts.find(contactsQuery).countDocuments(),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec(),
  ]);
  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return {
    data: contactsAll,
    ...paginationData,
  };
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
