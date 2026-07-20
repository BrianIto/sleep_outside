import {
  alertMessage,
  getLocalStorage,
  getParam,
  loadHeaderFooter,
  setLocalStorage,
  updateCartCount,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");
const dataSource = new ExternalServices();

const details = new ProductDetails(productId, dataSource);
details.init().then(() => {
  details.render();
});

function addProductToCart(product) {
  let oldArr = getLocalStorage("so-cart");
  // if it's not an array, empty and add as an array
  const isArray = Array.isArray(oldArr);
  if (!isArray) oldArr = [];
  // If this product is already in the cart, increase its quantity.
  const existingProduct = oldArr.find((item) => item.Id === product.Id);
  if (existingProduct) {
    existingProduct.quantity = Number(
      existingProduct.quantity ?? existingProduct.Quantity ?? 1,
    );
    existingProduct.quantity += 1;
  } else {
    oldArr.push({ ...product, quantity: 1 });
  }
  setLocalStorage("so-cart", oldArr);
  updateCartCount();
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
  alertMessage(`${product.Name} was added to your cart.`, false);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
