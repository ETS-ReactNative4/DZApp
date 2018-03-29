export const validateIntegerBetween = (value, lowerIncl, upperIncl) => {
  let valid = true;
  let intValue = parseInt(value, 10);
  if (!(value == intValue)) valid = false;
  if (intValue < lowerIncl || intValue > upperIncl) valid = false;
  return valid;
};
