const cleanString = (str) => {
  if (!str) return;
  const regex = /[a-z]/g;
  return str.trim().toLowerCase().match(regex).join('');
};

export const validateInput = ({ newList, setErrors, errorsList, items }) => {
  if (!newList.itemName) {
    setErrors(errorsList['empty']);
    return false;
  } else {
    for (const item of items) {
      if (cleanString(item.itemName) === cleanString(newList.itemName)) {
        setErrors(errorsList['duplicate']);
        return false;
      }
    }
  }
  return true;
};
