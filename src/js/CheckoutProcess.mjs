import ExternalServices from "./ExternalServices.mjs";
import { alertMessage, formDataToJSON, getLocalStorage } from "./utils.mjs";

// Convert cart products to the smaller item shape required by the API.
export function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice),
    quantity: Number(item.quantity ?? item.Quantity ?? 1),
  }));
}

export default class CheckoutProcess {
  constructor(
    cartKey = "so-cart",
    outputSelector = ".order-summary",
    services = new ExternalServices(),
  ) {
    this.cartKey = cartKey;
    this.outputSelector = outputSelector;
    this.services = services;
    this.items = [];
    this.itemSubtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  init() {
    this.items = getLocalStorage(this.cartKey) ?? [];
    this.calculateItemSubtotal();
  }

  // calculateItemSummary is retained as a descriptive public alias.
  calculateItemSummary() {
    return this.calculateItemSubtotal();
  }

  calculateItemSubtotal() {
    this.itemSubtotal = this.items.reduce(
      (total, item) =>
        total +
        Number(item.FinalPrice) * Number(item.quantity ?? item.Quantity ?? 1),
      0,
    );
    this.displayAmount("#subtotal", this.itemSubtotal);
    return this.itemSubtotal;
  }

  // Alias matching the original activity's method spelling.
  calculateOrdertotal() {
    return this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    const itemCount = this.items.reduce(
      (total, item) => total + Number(item.quantity ?? item.Quantity ?? 1),
      0,
    );

    this.tax = this.itemSubtotal * 0.06;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemSubtotal + this.tax + this.shipping;

    this.displayAmount("#tax", this.tax);
    this.displayAmount("#shipping", this.shipping);
    this.displayAmount("#orderTotal", this.orderTotal);
    return this.orderTotal;
  }

  displayAmount(selector, amount) {
    const output = document.querySelector(selector);
    if (output) output.textContent = `$${amount.toFixed(2)}`;
  }

  async checkout(form) {
    try {
      // Recalculate immediately before sending; the server must also verify totals.
      this.calculateItemSubtotal();
      this.calculateOrderTotal();

      const order = formDataToJSON(form);
      order.orderDate = new Date().toISOString();
      order.items = packageItems(this.items);
      order.orderTotal = this.orderTotal.toFixed(2);
      order.shipping = this.shipping;
      order.tax = this.tax.toFixed(2);

      const response = await this.services.checkout(order);
      localStorage.removeItem(this.cartKey);
      window.location.assign("/checkout/success.html");
      return response;
    } catch (error) {
      alertMessage(error.message);
      return null;
    }
  }
}
