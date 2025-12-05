import { updateCartCount } from "./global.js";

const summaryWrap = document.getElementById("summary-items");
const summaryTotal = document.getElementById("summary-total");
const form = document.getElementById("checkout-form");
const errorEl = document.getElementById("checkout-error");

function safeCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch (e) {
    console.error("Cart parse error:", e);
    return [];
  }
}

function renderSummary() {
  if (!summaryWrap || !summaryTotal || !form) return;

  const cart = safeCart();
  updateCartCount();

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
      const price = item.discountedPrice ?? item.price ?? 0;
      const qty = item.qty || 1;
      const sub = price * qty;
      total += sub;

      const imageUrl = item.image?.url || "";
      const title = item.title || "Product";

      return `
        <div class="checkout-item">
          <div class="checkout-item-inner">
            <img src="${imageUrl}" alt="${title}" class="checkout-item-thumb">
            <div>
              <strong>${title}</strong>
              <div class="checkout-item-meta">
                ${price.toFixed(2)} NOK × ${qty}
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

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (errorEl) errorEl.textContent = "";

    const cart = safeCart();

    if (!cart.length) {
      if (errorEl) errorEl.textContent = "Your cart is empty.";
      return;
    }

    const name = document.getElementById("fullName")?.value.trim();
    const mail = document.getElementById("email")?.value.trim();
    const addr = document.getElementById("address")?.value.trim();
    const card = document.getElementById("card")?.value.trim();

    if (!name || !mail || !addr || !card) {
      if (errorEl) errorEl.textContent = "Please fill in all fields.";
      return;
    }

    const orderId =
      "STAV-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    localStorage.removeItem("cart");
    updateCartCount();

    location.href = `./success.html?order=${encodeURIComponent(orderId)}`;
  });
}
