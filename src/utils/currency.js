export const formatCurrency = (value) => {
  if (!value) return "";
  const number = value.toString().replace(/[^\d]/g, "");
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(number)
    .replace("Rp", "Rp ");
};

export const parseCurrency = (value) => {
  if (!value) return 0;
  return parseInt(value.toString().replace(/[^\d]/g, "")) || 0;
};
