export const priceFormatter = (price) => {
  if (price == null) return ""; 
  return price.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const formatNumberToVND = (value) => {
  if (value == null) return ""; 
  const stringValue = String(value); 
  const number = parseInt(stringValue.replace(/\D/g, ""), 10);
  if (isNaN(number)) return "";

  return priceFormatter(number);
};
export const formatInputPrice = (input) => {
  if (!input) return ""; // Nếu không có giá trị, trả về chuỗi rỗng.

  // Loại bỏ các ký tự không phải số.
  const numericValue = input.toString().replace(/\D/g, "");

  // Định dạng giá trị thành '1.000.000'.
  return new Intl.NumberFormat("vi-VN").format(numericValue);
};
