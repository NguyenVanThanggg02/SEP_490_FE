export const shortPriceFormatter = (price = 0) => {
  if (price >= 1000000) {
    price = price / 1000000 + "M";
  } else if (price >= 1000) {
    price = price / 1000 + "K";
  }
  return price;
};
