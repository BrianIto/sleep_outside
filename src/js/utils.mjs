// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function updateCartCount() {
  const countElement = qs(".cart-count");
  if (!countElement) return;

  const cartItems = getLocalStorage("so-cart") ?? [];
  const itemCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity ?? item.Quantity ?? 1),
    0,
  );

  countElement.textContent = itemCount;
  countElement.hidden = itemCount === 0;
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(key) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(key);
}

// Convert the named controls in a form to a plain object.
export function formDataToJSON(form) {
  return Object.fromEntries(new FormData(form).entries());
}

export function alertMessage(message, scroll = true) {
  qs(".alert")?.remove();

  const alert = document.createElement("div");
  alert.className = "alert";
  alert.setAttribute("role", "alert");

  const messages =
    message && typeof message === "object"
      ? Object.values(message)
      : [message || "Something went wrong. Please try again."];
  const messageContainer = document.createElement("div");
  messages.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = String(text);
    messageContainer.append(paragraph);
  });

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "alert__close";
  closeButton.setAttribute("aria-label", "Dismiss message");
  closeButton.textContent = "×";
  closeButton.addEventListener("click", () => alert.remove());

  alert.append(messageContainer, closeButton);
  qs("main").prepend(alert);

  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Get a .html file template string
 * @param {string} path - the actual path to look. Should be in public
 */
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

/**
 * Render a template based on a .html file
 * @param { string } template - The template to be populated
 * @param { HTMLElement } parentElement - the Element to be populated using .innerHTML
 * @param { (...args) => void } callback - a callback to be called to populate the template.
 */
export async function renderWithTemplate(template, parentElement, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback();
  }
}

export async function loadHeaderFooter() {
  const [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate("/partials/header.html"),
    loadTemplate("/partials/footer.html"),
  ]);

  renderWithTemplate(headerTemplate, qs("header"), updateCartCount);
  renderWithTemplate(footerTemplate, qs("footer"));
}
