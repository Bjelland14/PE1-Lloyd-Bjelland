import { updateCartCount } from "./global.js";

const summaryWrap = document.getElementById("summary-items");
const summaryTotal = document.getElementById("summary-total");
const form = document.getElementById("checkout-form");
const errorEl = document.getElementById("checkout-error");

function renderSummary() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  updateCartCount();

  if (!cart.length) {
    summaryWrap.innerHTML = "<p>Your cart is empty.</p>";
    summaryTotal.textContent = "Total: 0 NOK";
    form.querySelector("button[type='submit']").setAttribute("disabled", "disabled");
    return;
  }

  let total = 0;
  summaryWrap.innerHTML = cart
    .map((item) => {
      const price = item.discountedPrice ?? item.price;
      const sub = price * (item.qty || 1);
      total += sub;

      return `
        <div class="cart-item" style="border:1px solid #eee; border-radius:10px; padding:.75rem; margin:.5rem 0;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${item.image?.url}" alt="${item.title}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;">
            <div>
              <strong>${item.title}</strong>
              <div style="font-size:.95rem; color:#555;">${price.toFixed(2)} NOK × ${item.qty || 1}</div>
            </div>
            <div style="margin-left:auto; font-weight:700;">${sub.toFixed(2)} NOK</div>
          </div>
        </div>
      `;
    })
    .join("");

  summaryTotal.textContent = `Total: ${total.toFixed(2)} NOK`;
  form.querySelector("button[type='submit']").removeAttribute("disabled");
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

  const orderId = "STAV-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  localStorage.removeItem("cart");
  updateCartCount();

  location.href = `./success.html?order=${encodeURIComponent(orderId)}`;
});

