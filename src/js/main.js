import ProductList from "./ProductList.mjs";
import ProductData from "./ProductData.mjs";
import { loadTemplate, renderWithTemplate } from "./utils.mjs";
const dataSource = new ProductData("tents");
const productList = new ProductList(
  dataSource,
  "tents",
  document.querySelector(".product-list"),
);

productList.init();

const headerTemplate = await loadTemplate("../partials/header.html");
const headerElement = document.querySelector("header");
renderWithTemplate(headerTemplate, headerElement);

const footerTemplate = await loadTemplate("../partials/footer.html");
const footerElement = document.querySelector("footer");
renderWithTemplate(footerTemplate, footerElement);
