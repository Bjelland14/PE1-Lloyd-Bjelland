import { getProduct, getProducts } from "./api.js";

const params = new URLSearchParams(location.search);
const id = params.get("id");

const container = document.getElementById("product-container");
const statusEl = document.getElementById("status");
const cartCountEl = document.getElementById("cart-count");

(async () => {
  if (!id) {
    if (statusEl) statusEl.textContent = "No product selected.";
    return;
  }

  try {
    const { data: product } = await getProduct(id);
    document.title = `STAV — ${product.title}`;
    renderProduct(product);
    updateCartCount();
    setupButtons(product);
    await renderRecommendations(product.id);
    if (statusEl) statusEl.textContent = "";
  } catch (error) {
    if (statusEl) statusEl.textContent = "Failed to load product.";
    console.error(error);
  }
})();

function renderProduct(p) {
  const hasDiscount = p.discountedPrice && p.discountedPrice < p.price;
  const price = hasDiscount
    ? `<s>${p.price.toFixed(2)} NOK</s> <strong>${p.discountedPrice.toFixed(
        2
      )} NOK</strong>`
    : `<strong>${p.price.toFixed(2)} NOK</strong>`;

  const rating = Math.max(0, Math.min(5, p.rating || 0));
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  const tags = Array.isArray(p.tags)
    ? p.tags.map((t) => `<span>#${t}</span>`).join(" ")
    : "";

  const reviews =
    Array.isArray(p.reviews) && p.reviews.length
      ? p.reviews
          .map(
            (r) => `
        <li class="review-item">
          <p><strong>${r.username}</strong></p>
          <p class="stars">${"★".repeat(r.rating)}${"☆".repeat(
              5 - r.rating
            )}</p>
          <p>${r.description}</p>
        </li>`
          )
          .join("")
      : "<li>No reviews yet.</li>";

  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser") || "null"
  );
  const canAddToCart = !!loggedInUser;

  container.innerHTML = `
    <article class="product">
      <div class="product-image">
        <img src="${p.image?.url}" alt="${p.image?.alt || p.title}">
      </div>

      <div class="product-info">
        <h1>${p.title}</h1>
        <p class="price">${price}</p>
        <p>${p.description || ""}</p>
        <p><strong>Rating:</strong> ${stars}</p>
        <div class="tags">${tags}</div>

        <div class="actions">
          ${
            canAddToCart
              ? `<button id="addToCartBtn" class="primary">Add to Cart</button>`
              : `<a href="./account/login.html" class="primary-btn">Login to add to cart</a>`
          }
          <button id="shareBtn" class="secondary">Share</button>
        </div>
      </div>
    </article>

    <section class="reviews">
      <h2>Customer Reviews</h2>
      <ul>${reviews}</ul>
    </section>

    <section id="recommendations" class="recommendations">
      <h2>Recommended Products</h2>
      <div id="recommendation-grid" class="grid"></div>
    </section>
  `;
}

function setupButtons(p) {
  const addBtn = document.getElementById("addToCartBtn");
  const shareBtn = document.getElementById("shareBtn");

  addBtn?.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === p.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: p.id,
        title: p.title,
        price: p.price,
        discountedPrice: p.discountedPrice,
        image: p.image,
        qty: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    addBtn.classList.add("added");
    addBtn.textContent = "✓ Added!";
    setTimeout(() => {
      addBtn.classList.remove("added");
      addBtn.textContent = "Add to Cart";
    }, 2000);
  });

  shareBtn?.addEventListener("click", async () => {
    const url = location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: p.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Product link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  if (cartCountEl)
    cartCountEl.textContent = totalItems > 0 ? `(${totalItems})` : "";
}

async function renderRecommendations(currentId) {
  try {
    const { data: products } = await getProducts({ limit: 12 });
    const others = products.filter((p) => p.id !== currentId);
    const picks = others.sort(() => 0.5 - Math.random()).slice(0, 3);

    const grid = document.getElementById("recommendation-grid");
    if (!grid) return;

    grid.innerHTML = picks
      .map(
        (p) => `
      <a class="card" href="./product.html?id=${p.id}">
        <div class="thumb">
          <img src="${p.image?.url}" alt="${p.image?.alt || p.title}" loading="lazy">
        </div>
        <h3>${p.title}</h3>
        <p><strong>${(p.discountedPrice ?? p.price).toFixed(2)} NOK</strong></p>
      </a>
    `
      )
      .join("");
  } catch (err) {
    console.error("Failed to load recommendations:", err);
  }
}
