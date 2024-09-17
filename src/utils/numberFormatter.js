export const priceFormatter = (price = 0) =>
  price.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

export const formatNumberToVND = (value) => {
  const stringValue = String(value); 
  const number = parseInt(stringValue.replace(/\D/g, ""), 10);
  if (isNaN(number)) return "";

  return priceFormatter(number);
};
