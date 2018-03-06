//@flow
import OrderLine from "../app/models/entities/OrderLine";
import IllegalAmountError from "../app/models/errors/IllegalAmountError";

describe("OrderLine", () => {
  let orderLine;

  beforeEach(() => {
    orderLine = new OrderLine(1);
  });

  it("Is initialized with quantity = 0", () => {
    expect(orderLine.quantity).toBe(0);
  });

  it("quantity can't be set to a negative value", () => {
    expect(() => {
      orderLine.quantity = -5;
    }).toThrowError(IllegalAmountError);
  });
  it("quantity is incremented by 1 when unit is added", () => {
    orderLine.addUnit();
    expect(orderLine.quantity).toBe(1);
  });
  it("quantity is decremented by 1 when unit is added", () => {
    orderLine.addUnit();
    orderLine.removeUnit();
    expect(orderLine.quantity).toBe(0);
  });
  it("quantity can't be decremented to a negative value", () => {
    expect(() => orderLine.removeUnit()).toThrow(IllegalAmountError);
  });
  it("can add a given amount of units", () => {
    orderLine.addUnits(2);
    expect(orderLine.quantity).toBe(2);
  });
  it("can't add a negative amount or zero units", () => {
    expect(() => orderLine.addUnits(-5)).toThrow(IllegalAmountError);
    expect(() => orderLine.addUnits(0)).toThrow(IllegalAmountError);
  });
});
