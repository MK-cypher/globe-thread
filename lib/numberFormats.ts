export const priceFormat = (amount: number) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    // throw new Error("Invalid input: must be a number or a numeric string");
    return `0`;
  }
  return new Intl.NumberFormat().format(numAmount);

  // const formattedAmount = numAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");

  // return `${formattedAmount}`;
};
