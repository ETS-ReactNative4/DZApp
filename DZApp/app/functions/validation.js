export const validateIntegerBetween = (value, lowerIncl, upperIncl) => {
  let valid = true;
  let intValue = parseInt(value, 10);
  if (!(value == intValue)) valid = false;
  if (intValue < lowerIncl || intValue > upperIncl) valid = false;
  return valid;
};

export const validateTopupAmount = value => {
  value = Number(value);
  let valid = true;
  if (isNaN(value)) valid = false;
  else if (Number(value) <= 0 || Number(value) > 100) valid = false;
  return valid;
};

export const reduceDecimals = (value, n) => {
  const decimals = (value.split(".")[1] || []).length;
  if (decimals > n) return (Math.round(value * 100) / 100).toString();
  else return value;
};
