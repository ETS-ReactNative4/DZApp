export const to_NL_be_DateString = (date: Date) => {
  return (
    pad(date.getDate()) +
    "/" +
    pad(date.getMonth() + 1) +
    "/" +
    date.getFullYear()
  );
};

const pad = (n: number) => {
  return n < 10 ? "0" + n : n;
};
