import {getProduct} from "./api.js";

const params = new URLSearchParams (location.search);
const id = params.get ("id");

const statusEl = document.getElementById ("status");
const container = document.getElementById ("product-container");

(async() => {
  if (!id) { statusEl.textContent = "No product ID specified."; return;}
  try {
    const { data } = await getProduct (id);
    document.title = `STAV — ${data.title}`;
    renderProduct (data);
    statusEl.textContent = "";
    wireActions (data);
  } catch (error) { 
    statusEl.textContent = "Failed to load product.";
    console.error (error);
   }
}) ();

function renderProduct (p) {
  const price = 
  p.discountedPrice && p.discountedPrice < p.price
      ? `<s>${p.price.toFixed(2)} NOK</s> <strong>${p.discountedPrice.toFixed(2)} NOK</strong>`
      : `<strong>${p.price.toFixed(2)} NOK</strong>`;

const rating = Number.isFinite (p.rating) ? p.rating : 0;
const tags = Array.isArray (p
const reviews = Array.isArray (p.reviews) && p.revies.length
? p.reviews.map(r => `<li><strong>${r.username}</strong> — ${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}<p>${r.description}</p></li>`).join("")
    : "<li>No reviews yet.</li>";


    container.innerHTML = `
    <article class="product">
      <div class="product-image">
        <img src="${p.image?.url || ""}" alt="${p.image?.alt || p.title}">
      </div>
      <div class="product-info">
        <h1>${p.title}</h1>
        <p class="price">${price}</p>
        <p>${p.description || ""}</p>
        <p><strong>Rating:</strong> ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
        <div class="tags">${tags}</div>
        <div class="actions">
          <button id="addToCartBtn" class="primary">Add to Cart</button>
          <button id="shareBtn" class="secondary">Share</button>
        </div>
      </div>
    </article>
    <section class="reviews">
      <h2>Customer Reviews</h2>
      <ul>${reviews}</ul>
    </section>
  `;
}

function wireActions(product) {
  const addBtn = document.getElementById("addToCartBtn");
  const shareBtn = document.getElementById("shareBtn");

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const ix = cart.findIndex(i => i.id === product.id);
      if (ix >= 0) {
        cart[ix].qty = (cart[ix].qty || 1) + 1;
      } else {
        cart.push({ id: product.id, title: product.title, price: product.price, discountedPrice: product.discountedPrice, image: product.image, qty: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to cart");
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const url = location.href;
      try {
        if (navigator.share) await navigator.share({ title: document.title, url });
        else {
          await navigator.clipboard.writeText(url);
          alert("Link copied");
        }
      } catch {}
    });
  }
}
