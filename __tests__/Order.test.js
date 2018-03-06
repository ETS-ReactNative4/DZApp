//@flow
import Order from "../models/Order";
import OrderLine from "../models/OrderLine";
import IllegalAmountError from "../models/errors/IllegalAmountError";

let order;

beforeEach(() => {
  order = new Order();
});

describe("Order", () => {
  describe("constructor", () => {
    it("orderlines are initialized in constructor", () => {
      expect(order.orderLines).toBeInstanceOf(Map);
      expect(order.orderLines.size).toBe(0);
    });
    it("memberId is not initialized in constructor", () => {
      expect(order.memberId).toBeUndefined();
    });
    it("orderId is not initialized in constructor", () => {
      expect(order.orderId).toBeUndefined();
    });
  });

  describe("addUnit", () => {
    it(
      "Creates a new orderline when first unit of product is " +
        "added and sets its quantity to 1",
      () => {
        expect(order.orderLines.get(1)).toBeUndefined();
        order.addUnit(1);
        expect(order.orderLines.get(1)).toBeInstanceOf(OrderLine);
        expect(order.orderLines.get(1).quantity).toBe(1);
      }
    );
    it("Adds a unit to an existing orderline", () => {
      order.addUnit(1);
      order.addUnit(1);
      expect(order.orderLines.get(1).quantity).toBe(2);
    });
  });

  describe("addUnits", () => {
    it(
      "Creates a new orderline when first units of product are " +
        "added and sets its quantity to amount  the units to add",
      () => {
        expect(order.orderLines.get(1)).toBeUndefined();
        order.addUnits(1, 5);
        expect(order.orderLines.get(1)).toBeInstanceOf(OrderLine);
        expect(order.orderLines.get(1).quantity).toBe(5);
      }
    );
    it("Throws an IllegalAmountError when trying to add a negative amount or zero units", () => {
      expect(() => order.addUnits(1, -5)).toThrow(IllegalAmountError);
    });
  });

  describe("removeUnit", () => {
    it("removes a unit from an existing orderline", () => {
      order.addUnit(1);
      order.removeUnit(1);
      expect(order.orderLines.get(1).quantity).toBe(0);
    });
    it(
      "Throws an IllegalAmountError when attempting to remove units from" +
        " a nonexisting or empty orderline",
      () => {
        order.addUnit(1);
        order.removeUnit(1);
        expect(() => order.removeUnit(1)).toThrow(IllegalAmountError);

        expect(() => order.removeUnit(2)).toThrow(IllegalAmountError);
      }
    );
  });

  describe("setQuantity", () => {
    it("Creates a new orderline when orderline with given productid is non-existant", () => {
      expect(order.orderLines.get(1)).toBeUndefined();
      order.setQuantity(1, 5);
      expect(order.orderLines.get(1)).toBeInstanceOf(OrderLine);
      expect(order.orderLines.get(1).quantity).toBe(5);
    });
    it("Sets the quantity of the orderline with the given productid to the given quantity", () => {
      order.addUnit(1);
      order.setQuantity(1, 5);
      expect(order.orderLines.get(1).quantity).toBe(5);
    });
    it("Throws an error when setting the quantity of an existing orderline to a negative value", () => {
      order.addUnit(1);
      expect(() => order.setQuantity(-5)).toThrow(IllegalAmountError);
    });
    it("Throws an error when attempting to set the value of a non existing orderline to a negative value", () => {
      expect(() => order.setQuantity(-5)).toThrow(IllegalAmountError);
    });
  });
});
