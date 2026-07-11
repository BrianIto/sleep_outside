import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam } from "./utils.mjs";

const productId = getParam("product");
const dataSource = new ProductData("tents");

const details = new ProductDetails(productId, dataSource);
details.init().then(() => {
  details.render();
});

function addProductToCart(product) {
  let oldArr = getLocalStorage("so-cart");
  // if it's not an array, empty and add as an array
  const isArray = Array.isArray(oldArr);
  if (!isArray) oldArr = [];
  // if it's already there, add an amount
  oldArr.push(product);
  setLocalStorage("so-cart", oldArr);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
