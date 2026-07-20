import CheckoutProcess from "./CheckoutProcess.mjs";

const checkoutProcess = new CheckoutProcess("so-cart");
const form = document.forms.checkout;
const zip = form.elements.zip;
const status = document.querySelector("#checkout-status");
const submitButton = form.querySelector("button[type=submit]");

checkoutProcess.init();

zip.addEventListener("change", () => {
  if (zip.value.trim()) checkoutProcess.calculateOrderTotal();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  status.textContent = "Submitting your order…";

  try {
    const response = await checkoutProcess.checkout(form);
    if (response) {
      status.textContent =
        response.message || "Your order was submitted successfully.";
    } else {
      status.textContent = "";
      submitButton.disabled = false;
    }
  } catch (error) {
    status.textContent = error.message;
    submitButton.disabled = false;
  }
});
