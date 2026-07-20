import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, listElement);

const categoryName = category
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
document.querySelector("#listing-title").textContent =
  `Top Products: ${categoryName}`;
document.title = `Sleep Outside | ${categoryName}`;

productList.init();
