import { getProduct } from "./api.js";

const params = new URLSearchParams(location.search);
const id = params.get("id");

const statusEl = document.getElementById("status");
const container = document.getElementById("product-container");

(async function loadProduct() {
  if (!id) {
    statusEl.textContent = "No product selected.";
    return;
  }

  try {
    const { data } = await getProduct(id);

    document.title = `STAV — ${data.title}`;
    renderProduct(data);
    statusEl.textContent = "";
  } catch (error) {
    statusEl.textContent = "Failed to load product.";
    console.error(error);
  }
})();

function renderProduct(p) {
  const discounted =
    p.discountedPrice && p.discountedPrice < p.price
      ? `<s>${p.price.toFixed(2)} NOK</s> <strong>${p.discountedPrice.toFixed(2)} NOK</strong>`
      : `<strong>${p.price.toFixed(2)} NOK</strong>`;

  const reviews = p.reviews?.length
    ? p.reviews
        .map(
          (r) => `
        <li>
          <strong>${r.username}</strong> — ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}  
          <p>${r.description}</p>
        </li>`
        )
        .join("")
    : "<li>No reviews yet.</li>";

  container.innerHTML = `
    <article class="product">
      <div class="product-image">
        <img src="${p.image?.url}" alt="${p.image?.alt || p.title}">
      </div>
      <div class="product-info">
        <h1>${p.title}</h1>
        <p class="price">${discounted}</p>
        <p>${p.description}</p>
        <p><strong>Rating:</strong> ${"★".repeat(p.rating)}${"☆".repeat(5 - p.rating)}</p>
        <div class="tags">${p.tags.map((t) => `<span>#${t}</span>`).join(" ")}</div>
        <button id="addToCartBtn" class="primary">Add to Cart</button>

        <div class="share">
          <p>Share this product:</p>
          <input type="text" readonly value="${location.href}" />
        </div>
      </div>
    </article>

    <section class="reviews">
      <h2>Customer Reviews</h2>
      <ul>${reviews}</ul>
    </section>
  `;
}
