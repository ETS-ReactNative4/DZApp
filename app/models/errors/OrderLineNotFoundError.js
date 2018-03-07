//@flow
export default class OrderLineNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "OrderLineNotFoundError";
  }
}
