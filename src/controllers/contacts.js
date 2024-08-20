import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  createContact,
  changeContactName,
  deleteContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';

export async function getAllContactsContoller(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contactsAll = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId: req.user._id,
  });
  res.status(200).send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsAll,
  });
}

export async function getContactByIdController(req, res, next) {
  console.log(req.user);
  const { contactId } = req.params;
  const userId = req.user._id;
  const contactById = await getContactById(contactId, userId);
  console.log(contactById);
  if (contactById === null) {
    return next(createHttpError(403, 'Contact not allowed'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contactById,
  });
}

export async function createContactController(req, res) {
  const photo = req.file;
  console.log(photo);
  let photoUrl;
  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const newContact = await createContact({
    ...req.body,
    photo: photoUrl,
  });
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: newContact,
  });
}

export async function changeContactNameController(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const changeContact = await changeContactName(
    contactId,
    {
      ...req.body,
      photo: photoUrl,
    },
    userId,
  );
  if (changeContact === null) {
    return next(createHttpError(403, 'Contact not allowed'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: changeContact,
  });
}

export async function deleteContactController(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleteContact(contactId, userId);
  if (contact === null) {
    return next(createHttpError(403, `Contact is not allowed`));
  }

  res.status(204).send();
}
