export const searchListHandler = ({ value, items }) =>
  items.filter((item) =>
    item?.itemName.toLowerCase().includes(value.toLowerCase()),
  );
