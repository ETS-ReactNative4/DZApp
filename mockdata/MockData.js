//@flow
import Product from "../models/Product";
import Category from "../models/Category";

let MockCategories = [
  new Category(1, "Frisdranken"),
  new Category(2, "Warme Dranken"),
  new Category(3, "Bieren"),
  new Category(4, "Wijnen"),
  new Category(5, "Snacks")
];

let MockProducts = [
  new Product(
    1,
    "Coca cola",
    1.5,
    "https://www.prikentik.be/media/catalog/product/cache/small_image/400x400/beff4985b56e3afdbeabfc89641a4582/c/o/coca-cola-orginal-fles-20cl_1.png",
    1
  ),
  new Product(
    2,
    "Fanta",
    1.5,
    "https://colruyt.collectandgo.be/cogo/step/JPG/JPG/200x200/std.lang.all/12/74/asset-1391274.jpg",
    1
  ),
  new Product(
    3,
    "Koffie",
    1.25,
    "https://colruyt.collectandgo.be/cogo/step/JPG/JPG/200x200/std.lang.all/87/11/asset-338711.jpg",
    2
  ),
  new Product(
    4,
    "Thee",
    1.25,
    "https://colruyt.collectandgo.be/cogo/step/JPG/JPG/200x200/std.lang.all/60/91/asset-806091.jpg",
    2
  ),
  new Product(
    5,
    "Jupiler",
    1.75,
    "https://colruyt.collectandgo.be/cogo/step/JPG/JPG/200x200/std.lang.all/91/12/asset-1359112.jpg",
    3
  ),
  new Product(
    6,
    "Duvel",
    2.0,
    "https://colruyt.collectandgo.be/cogo/step/JPG/JPG/200x200/std.lang.all/65/68/asset-336568.jpg",
    3
  )
];

export { MockCategories, MockProducts };
