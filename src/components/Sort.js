const DayInMilliSeconds = 60 * 60 * 24 * 1000;

const calculateActive = (item) => {
  if (item.totalPurchases === 1) {
    return false;
  } else if (!item.estimatedPurchaseInterval) {
    return true;
  } else {
    return (
      (Date.now() - item.lastPurchase) /
        (item.estimatedPurchaseInterval * DayInMilliSeconds) <
      2
    );
  }
};

const sortByName = (a, b) => {
  if (a.itemName.toLowerCase() < b.itemName.toLowerCase()) {
    return -1;
  } else {
    return 1;
  }
};

const sortByEstimatedPurchaseInterval = (a, b) => {
  if (a.estimatedPurchaseInterval < b.estimatedPurchaseInterval) {
    return -1;
  } else if (a.estimatedPurchaseInterval > b.estimatedPurchaseInterval) {
    return 1;
  } else {
    return sortByName(a, b);
  }
};

export const SortItems = ({ items }) => {
  return items.sort((a, b) => {
    if (calculateActive(a) && !calculateActive(b)) {
      return -1;
    } else if (!calculateActive(a) && calculateActive(b)) {
      return 1;
    }

    return sortByEstimatedPurchaseInterval(a, b);
  });
};
