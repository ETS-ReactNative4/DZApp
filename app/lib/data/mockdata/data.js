//@flow

import Product from "../../../models/Product";
import Customer from "../../../models/Customer";
import Event from "../../../models/Event";
import EventSubscription from "../../../models/EventSubscription";
import Roles from "../../../models/Roles";

const MockProducts = [
  new Product(
    1,
    "Coca cola",
    1.5,
    "https://www.prikentik.be/media/catalog/product/cache/small_image/400x400/beff4985b56e3afdbeabfc89641a4582/c/o/coca-cola-orginal-fles-20cl_1.png",
    120,
    48
  ),
  new Product(
    2,
    "Fanta",
    1.5,
    "https://colruyt.collectandgo.be/cogo/step/JPG/JPG/200x200/std.lang.all/12/74/asset-1391274.jpg",
    120,
    48
  ),
  new Product(
    3,
    "Koffie",
    1.25,
    "https://colruyt.collectandgo.be/cogo/step/JPG/JPG/200x200/std.lang.all/87/11/asset-338711.jpg",
    72,
    36
  ),
  new Product(
    4,
    "Thee",
    1.25,
    "https://colruyt.collectandgo.be/cogo/step/JPG/JPG/200x200/std.lang.all/60/91/asset-806091.jpg",
    72,
    36
  ),
  new Product(
    5,
    "Jupiler",
    1.75,
    "https://colruyt.collectandgo.be/cogo/step/JPG/JPG/200x200/std.lang.all/91/12/asset-1359112.jpg",
    120,
    24
  ),
  new Product(
    6,
    "Duvel",
    2.0,
    "https://colruyt.collectandgo.be/cogo/step/JPG/JPG/200x200/std.lang.all/65/68/asset-336568.jpg",
    120,
    24
  )
];

const MockEvents = [
  new Event(
    1,
    "Hamlet Repetitie 1",
    new Date("March 30, 2018"),
    new Date("March 30, 2018"),
    null
  ),
  new Event(
    2,
    "Hamlet Repetitie 2",
    new Date("April 7, 2018"),
    new Date("April 7, 2018"),
    null
  ),
  new Event(
    3,
    "Mosselfestijn",
    new Date("April 14, 2018"),
    new Date("April 14, 2018"),
    5.0
  )
];

const MockCustomers = [
  new Customer(
    1,
    "Clooney",
    "George",
    Roles.CASHIER,
    10.0,
    "georgieboy",
    "Letmein123",
    "salty"
  ),
  new Customer(
    2,
    "Depp",
    "Johnny",
    Roles.MEMBER,
    20.0,
    "johnnieboy",
    "Letmein12",
    "salty"
  ),
  new Customer(
    3,
    "Blanchett",
    "Kate",
    Roles.EXTERNAL,
    25.0,
    "katiegirl",
    "Letmein123",
    "salty"
  )
];

const MockEventSubscriptions = [
  new EventSubscription(1, 3, 5.0),
  new EventSubscription(2, 3, 5.0),
  new EventSubscription(3, 3, 5.0)
];

export { MockProducts, MockEvents, MockCustomers, MockEventSubscriptions };
