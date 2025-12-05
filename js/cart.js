console.log("Cart script loaded ");

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
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  cartCountEl.textContent = totalQty > 0 ? `(${totalQty})` : "";
}


function renderCart() {
  const cart = safeCart();

  if (!cartContainer || !cartTotal) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total: 0 NOK";
    if (checkoutBtn) {
      checkoutBtn.setAttribute("aria-disabled", "true");
    }
    updateCartCount();
    return;
  }

  let total = 0;

  cartContainer.innerHTML = cart
    .map((item, index) => {
      const price = item.discountedPrice ?? item.price ?? 0;
      const qty   = item.qty || 1;
      const sub   = price * qty;
      total += sub;

      const title = item.title || "Product";
      const imageUrl = item.image?.url || "";

      return `
        <div class="cart-item">
          <img src="${imageUrl}" alt="${title}" />
          <div>
            <h3>${title}</h3>
            <p>${price.toFixed(2)} NOK × ${qty}</p>
          </div>
          <strong>${sub.toFixed(2)} NOK</strong>
          <button class="remove-btn" data-index="${index}" aria-label="Remove item">✕</button>
        </div>
      `;
    })
    .join("");

  cartTotal.textContent = `Total: ${total.toFixed(2)} NOK`;

  if (checkoutBtn) {
    checkoutBtn.removeAttribute("aria-disabled");
  }

  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", (event) => {
      const index = Number(event.currentTarget.dataset.index);
      const cartNow = safeCart();
      cartNow.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cartNow));
      renderCart();
      updateCartCount();
    })
  );

  updateCartCount();
}


clearBtn?.addEventListener("click", () => {
  const confirmed = confirm("Are you sure you want to clear your cart?");
  if (!confirmed) return;

  localStorage.removeItem("cart");
  renderCart();
  updateCartCount();
});


checkoutBtn?.addEventListener("click", (event) => {
  const isDisabled = checkoutBtn.getAttribute("aria-disabled") === "true";

  if (isDisabled) {
    event.preventDefault();
    alert("Your cart is empty.");
    return;
  }

  const cart = safeCart();
  if (!cart.length) {
    event.preventDefault();
    alert("Your cart is empty.");
    return;
  }


});
