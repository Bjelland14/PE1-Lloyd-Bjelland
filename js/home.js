import { getProducts } from "./api.js";

const grid = document.getElementById("products-grid");
const statusEl = document.getElementById("status");
const carousel = document.getElementById("carousel");

(async () => {
  try {
    const { data: items } = await getProducts({ limit: 12 });
    grid.innerHTML = items.map(card).join("");

    const { data: featured } = await getProducts({ limit: 3 });
    carousel.innerHTML = featured.map(card).join("");

    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = err.message || "Something went wrong.";
  }
})();

function card(p) {
  const price =
    p.discountedPrice && p.discountedPrice < p.price
      ? `<s>${p.price.toFixed(2)} NOK</s> <strong>${p.discountedPrice.toFixed(2)} NOK</strong>`
      : `<strong>${p.price.toFixed(2)} NOK</strong>`;

  return `
    <a class="card" href="./product.html?id=${p.id}">
      <img src="${p.image?.url}" alt="${p.image?.alt || p.title}">
      <h3>${p.title}</h3>
      <p>${price}</p>
    </a>
  `;
}
