import ProductList from "./ProductList.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productList = new ProductList(
  dataSource,
  "tents",
  document.querySelector(".product-list"),
);

productList.init();
