const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const iscontactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);

  if (iscontactType(contactType)) return contactType;
};

const parseBoolean = (value) => {
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
  }
  return undefined;
};

export const parseFilterParams = (query) => {
  const { type, checked } = query;
  const parsedType = parseContactType(type);
  const parsedChecked = parseBoolean(checked);
  return { type: parsedType, checked: parsedChecked };
};
