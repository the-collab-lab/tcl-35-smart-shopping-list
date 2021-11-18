const calculateActive = (item, ratio) => {
  if (item.totalPurchases === 1) {
    return false;
  } else if (!item.estimatedPurchaseInterval) {
    return true;
  } else {
    return (
      (Date.now() - item.lastPurchase) /
        (item.estimatedPurchaseInterval * ratio) <
      2
    );
  }
};

const sortByName = (a, b) => {
  console.log(a.itemName, b.itemName);
  if (a.itemName.toLowerCase() < b.itemName.toLowerCase()) {
    return -1;
  } else {
    return 1;
  }
};

const sortByEstimatedPurchaseInterval = (a, b) => {
  console.log(a.estimatedPurchaseInterval, b.estimatedPurchaseInterval);
  if (a.estimatedPurchaseInterval < b.estimatedPurchaseInterval) {
    return -1;
  } else if (a.estimatedPurchaseInterval > b.estimatedPurchaseInterval) {
    return 1;
  } else {
    return sortByName(a, b);
  }
};

export const sortItems = ({ items, ratio }) => {
  return items.sort((a, b) => {
    if (calculateActive(a, ratio) && !calculateActive(b, ratio)) {
      return -1;
    } else if (!calculateActive(a, ratio) && calculateActive(b, ratio)) {
      return 1;
    }

    return sortByEstimatedPurchaseInterval(a, b);
  });
};

// sortItems(items);
