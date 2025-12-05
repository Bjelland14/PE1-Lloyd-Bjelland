import { updateCartCount } from "./global.js";

const summaryWrap = document.getElementById("summary-items");
const summaryTotal = document.getElementById("summary-total");
const form = document.getElementById("checkout-form");
const errorEl = document.getElementById("checkout-error");

function renderSummary() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  updateCartCount();

  if (!summaryWrap || !summaryTotal || !form) return;

  const submitBtn = form.querySelector("button[type='submit']");

  if (!cart.length) {
    summaryWrap.innerHTML = "<p>Your cart is empty.</p>";
    summaryTotal.textContent = "Total: 0 NOK";
    if (submitBtn) submitBtn.setAttribute("disabled", "disabled");
    return;
  }

  let total = 0;
  summaryWrap.innerHTML = cart
    .map((item) => {
      const price = item.discountedPrice ?? item.price;
      const sub = price * (item.qty || 1);
      total += sub;

      return `
        <div class="checkout-item">
          <div class="checkout-item-inner">
            <img src="${item.image?.url}" alt="${
        item.title
      }" class="checkout-item-thumb">
            <div>
              <strong>${item.title}</strong>
              <div class="checkout-item-meta">
                ${price.toFixed(2)} NOK × ${item.qty || 1}
              </div>
            </div>
            <div class="checkout-item-total">
              ${sub.toFixed(2)} NOK
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  summaryTotal.textContent = `Total: ${total.toFixed(2)} NOK`;
  if (submitBtn) submitBtn.removeAttribute("disabled");
}

renderSummary();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (!cart.length) {
    errorEl.textContent = "Your cart is empty.";
    return;
  }

  const name = document.getElementById("fullName").value.trim();
  const mail = document.getElementById("email").value.trim();
  const addr = document.getElementById("address").value.trim();
  const card = document.getElementById("card").value.trim();

  if (!name || !mail || !addr || !card) {
    errorEl.textContent = "Please fill in all fields.";
    return;
  }

  const orderId =
    "STAV-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  localStorage.removeItem("cart");
  updateCartCount();

  location.href = `./success.html?order=${encodeURIComponent(orderId)}`;
});
