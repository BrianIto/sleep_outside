import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") ?? [];
  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index),
  );
  const actions = document.querySelector(".cart-actions");
  if (cartItems.length > 0) {
    const cartTotal = cartItems.reduce(
      (total, item) =>
        total +
        Number(item.FinalPrice) * Number(item.quantity ?? item.Quantity ?? 1),
      0,
    );
    actions.innerHTML = `
      <p class="cart-total">Cart Total: <strong>$${cartTotal.toFixed(2)}</strong></p>
      <a class="checkout-link" href="/checkout/index.html">Checkout</a>`;
  } else {
    htmlItems.push(`<li class="empty-cart">Cart is empty for now</li>`);
    actions.innerHTML = "";
  }
  document.querySelector(".cart-product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item, index) {
  const productUrl = `/product_pages/index.html?product=${item.Id}`;
  const quantity = Number(item.quantity ?? item.Quantity ?? 1);
  const newItem = `<li class="cart-card divider">
  <a href="${productUrl}" class="cart-card__image">
    <img
      src="${item.Images?.PrimaryMedium ?? item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="${productUrl}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <label class="cart-card__quantity">
    Qty:
    <input class="cart-card__quantity-input" type="number" min="1" step="1" value="${quantity}" data-index="${index}" aria-label="Quantity for ${item.Name}" />
  </label>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__remove" type="button" data-index="${index}" aria-label="Remove ${item.Name} from cart">&times;</button>
</li>`;

  return newItem;
}

function saveCart(cartItems) {
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  updateCartCount();
}

function removeCartItem(index) {
  const cartItems = getLocalStorage("so-cart") ?? [];
  cartItems.splice(index, 1);
  saveCart(cartItems);
}

function updateCartItemQuantity(index, quantity) {
  const cartItems = getLocalStorage("so-cart") ?? [];
  if (!cartItems[index] || !Number.isInteger(quantity) || quantity < 1) {
    renderCartContents();
    return;
  }

  cartItems[index].quantity = quantity;
  saveCart(cartItems);
}

const cartList = document.querySelector(".cart-product-list");
cartList.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".cart-card__remove");
  if (removeButton) removeCartItem(Number(removeButton.dataset.index));
});

cartList.addEventListener("change", (event) => {
  if (event.target.matches(".cart-card__quantity-input")) {
    updateCartItemQuantity(
      Number(event.target.dataset.index),
      Number(event.target.value),
    );
  }
});

renderCartContents();
