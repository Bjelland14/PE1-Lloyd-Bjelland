console.log("Cart script loaded ✅");

const cartContainer = document.getElementById("cart-items");
const cartTotal     = document.getElementById("cart-total");
const clearBtn      = document.getElementById("clear-cart");
const checkoutBtn   = document.getElementById("go-checkout");
const cartCountEl   = document.getElementById("cart-count");

renderCart();
updateCartCount();

function safeCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch (e) {
    console.error("Cart parse error:", e);
    return [];
  }
}

function updateCartCount() {
  if (!cartCountEl) return;
  const cart = safeCart();
  const totalQty = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
  cartCountEl.textContent = totalQty > 0 ? `(${totalQty})` : "";
}

function renderCart() {
  const cart = safeCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total: 0 NOK";
    checkoutBtn?.setAttribute("aria-disabled", "true");
    checkoutBtn?.classList.add("disabled");
    updateCartCount();
    return;
  }

  let total = 0;

  cartContainer.innerHTML = cart
    .map((item, i) => {
      const price = item.discountedPrice ?? item.price ?? 0;
      const qty   = item.qty || 1;
      const sub   = price * qty;
      total += sub;

      return `
        <div class="cart-item">
          <img src="${item.image?.url || ""}" alt="${item.title || "Product"}" />
          <div>
            <h3>${item.title || "Product"}</h3>
            <p>${price.toFixed(2)} NOK × ${qty}</p>
          </div>
          <strong>${sub.toFixed(2)} NOK</strong>
          <button class="remove-btn" data-index="${i}" aria-label="Remove item">✕</button>
        </div>
      `;
    })
    .join("");

  cartTotal.textContent = `Total: ${total.toFixed(2)} NOK`;

  checkoutBtn?.removeAttribute("aria-disabled");
  checkoutBtn?.classList.remove("disabled");

  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const i = Number(e.currentTarget.dataset.index);
      const cartNow = safeCart();
      cartNow.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify(cartNow));
      renderCart();
      updateCartCount();
    })
  );

  updateCartCount();
}

clearBtn?.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear your cart?")) {
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
  }
});

checkoutBtn?.addEventListener("click", (e) => {
  const disabled = checkoutBtn.getAttribute("aria-disabled") === "true";
  if (disabled) {
    e.preventDefault();
    alert("Your cart is empty.");
    return;
  }

  const cart = safeCart();
  if (!cart.length) {
    e.preventDefault();
    alert("Your cart is empty.");
    return;
  }

  window.location.href = "./checkout.html";
});
