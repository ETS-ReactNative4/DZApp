//@flow
export default class IllegalAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "IllegalAmountError";
  }
}
