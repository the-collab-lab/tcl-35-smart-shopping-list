const cleanString = (str) => {
  const regex = /[a-z]/g;
  return str.trim().toLowerCase().match(regex).join('');
};

export const validateInput = ({ newItem, setErrors, errorsList, items }) => {
  if (!newItem.itemName) {
    setErrors(errorsList['empty']);
    return false;
  } else {
    for (const item of items) {
      if (cleanString(item.itemName) === cleanString(newItem.itemName)) {
        setErrors(errorsList['duplicate']);
        return false;
      }
    }
  }
  return true;
};
