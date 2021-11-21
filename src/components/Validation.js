const cleanString = (str) => {
  const regex = /[a-z]/g;
  return str.trim().toLowerCase().match(regex).join('');
};

export const validateInput = ({ newList, setErrors, errorsList, items }) => {
  console.log(newList, setErrors, errorsList, items);
  if (!newList) {
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
