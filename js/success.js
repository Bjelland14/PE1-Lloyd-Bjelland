localStorage.removeItem("cart");

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  el.textContent = total > 0 ? `(${total})` : "";
}

updateCartCount();

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const order = params.get("order");

  const line = document.getElementById("order-line");
  if (line && order) {
    line.textContent = `Your order number is ${order}. A confirmation has been sent to your email.`;
  } else if (line) {
    line.textContent = "Your order is confirmed. A confirmation has been sent to your email.";
  }

  const message = document.querySelector(".success-message");
  if (message) {
    message.style.opacity = 0;
    setTimeout(() => {
      message.style.opacity = 1;
    }, 150);
  }
});
