import { getProduct } from "./api.js";

const params = new URLSearchParams(location.search);
const id = params.get("id");
const container = document.getElementById("product-container");
const statusEl = document.getElementById("status");

(async () => {
  if (!id) { statusEl.textContent = "No product selected."; return; }
  try {
    const { data: p } = await getProduct(id);
    document.title = `STAV — ${p.title}`;
    render(p);
    statusEl.textContent = "";
    wire(p);
  } catch (e) {
    statusEl.textContent = "Failed to load product.";
    console.error(e);
  }
})();

function render(p){
  const hasDisc = p.discountedPrice && p.discountedPrice < p.price;
  const price = hasDisc
    ? `<s>${p.price.toFixed(2)} NOK</s> <strong>${p.discountedPrice.toFixed(2)} NOK</strong>`
    : `<strong>${p.price.toFixed(2)} NOK</strong>`;
  const rating = Number.isFinite(p.rating) ? p.rating : 0;
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const tags = Array.isArray(p.tags) && p.tags.length ? p.tags.map(t=>`<span>#${t}</span>`).join(" ") : "";
  const reviews = Array.isArray(p.reviews) && p.reviews.length
    ? p.reviews.map(r=>`<li><strong>${r.username}</strong> — ${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}<p>${r.description}</p></li>`).join("")
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
        <p><strong>Rating:</strong> ${stars}</p>
        <div class="tags">${tags}</div>
        <div class="actions">
          <button id="addToCartBtn" class="primary">Add to Cart</button>
          <button id="shareBtn" class="secondary">Share</button>
        </div>
      </div>
    </article>

    <section class="reviews panel">
      <h2>Product Reviews</h2>
      <ul>${reviews}</ul>
    </section>
  `;
}

function wire(p){
  const addBtn = document.getElementById("addToCartBtn");
  const shareBtn = document.getElementById("shareBtn");

  addBtn?.addEventListener("click", ()=>{
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const ix = cart.findIndex(i=>i.id === p.id);
    if (ix >= 0) cart[ix].qty = (cart[ix].qty || 1) + 1;
    else cart.push({ id:p.id, title:p.title, price:p.price, discountedPrice:p.discountedPrice, image:p.image, qty:1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  });

  shareBtn?.addEventListener("click", async ()=>{
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title: document.title, url });
      else { await navigator.clipboard.writeText(url); alert("Link copied"); }
    } catch {}
  });
}
