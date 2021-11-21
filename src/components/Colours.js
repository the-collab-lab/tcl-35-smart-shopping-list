const DayInMilliSeconds = 60 * 60 * 24 * 1000;

export const addAriaLabelHelper = ({ interval, last, next, total, name }) => {
  const ratio = (Date.now() - last) / (interval * DayInMilliSeconds);

  if (total === 1 || (ratio > 2 && interval)) {
    return `${name} is no longer active.`;
  } else if (next === 7) {
    return `Buy ${name} every ${next} days`;
  } else if (next === 14) {
    return `Buy ${name} every ${next} days`;
  } else if (next === 30) {
    return `Buy ${name} every ${next} days`;
  }
};

export const addBgColourHelper = ({ interval, last, next, total }) => {
  const ratio = (Date.now() - last) / (interval * DayInMilliSeconds);
  if (total === 1 || (ratio > 2 && interval)) {
    return 'red-bg';
  } else {
    if (next === 7) {
      return 'green-bg';
    } else if (next === 14) {
      return 'yellow-bg';
    } else if (next === 30) {
      return 'purple-bg';
    }
  }
};
