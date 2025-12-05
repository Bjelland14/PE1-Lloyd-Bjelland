// home.js
import { getProducts } from "./api.js";

const grid = document.getElementById("products-grid");
const statusEl = document.getElementById("status");

const track = document.getElementById("carousel-track");
const dotsEl = document.getElementById("carousel-dots");
const prevBtn = document.querySelector(".carousel .prev");
const nextBtn = document.querySelector(".carousel .next");

const featuredGrid = document.getElementById("featured-grid");

let idx = 0;
let slides = [];
let allProducts = [];

/**
 * Render product grid cards.
 */
function renderGrid(products) {
  if (!grid) return;
  grid.innerHTML = products.map(card).join("");
}

/**
 * Initial load: fetch products and set up hero, featured, and grid.
 */
(async () => {
  try {
    const { data: items } = await getProducts({ limit: 12 });

    allProducts = items;

    const heroProducts = items.slice(0, 3);
    const hotProducts = items.slice(3, 7);

    // Featured / "Hot right now"
    if (featuredGrid && hotProducts.length) {
      featuredGrid.innerHTML = hotProducts.map(featuredCard).join("");
    }

    // Grid viser alle produktene (oppgaven: minst 12 i grid)
    renderGrid(items);

    // Hero carousel
    if (track && dotsEl && heroProducts.length) {
      track.innerHTML = heroProducts.map(slideHTML).join("");

      dotsEl.innerHTML = heroProducts
        .map(
          (_, i) =>
            `<button type="button" ${
              i === 0 ? 'aria-current="true"' : ""
            } aria-label="Go to slide ${i + 1}"></button>`
        )
        .join("");

      slides = Array.from(track.children);
      wireCarousel();
    }

    if (statusEl) statusEl.textContent = "";
  } catch (err) {
    console.error(err);
    if (statusEl) statusEl.textContent = err.message || "Something went wrong.";
  }
})();

/**
 * Format price with discount logic.
 */
function formatPrice(p) {
  const base = typeof p.price === "number" ? p.price : 0;
  const value =
    typeof p.discountedPrice === "number" && p.discountedPrice < base
      ? p.discountedPrice
      : base;

  return `<strong>${value.toFixed(2)} NOK</strong>`;
}

/**
 * Regular product card for grid.
 */
function card(p) {
  const price = formatPrice(p);
  const imageUrl = p.image?.url || "";
  const altText = p.image?.alt || p.title || "Product";

  return `
    <a class="card" href="./product.html?id=${p.id}">
      <img src="${imageUrl}" alt="${altText}">
      <h3>${p.title}</h3>
      <p>${price}</p>
    </a>
  `;
}

/**
 * Featured product card ("Hot right now").
 */
function featuredCard(p) {
  const price = formatPrice(p);
  const imageUrl = p.image?.url || "";
  const altText = p.image?.alt || p.title || "Product";

  return `
    <a class="card featured-card" href="./product.html?id=${p.id}">
      <img src="${imageUrl}" alt="${altText}">
      <div class="featured-info">
        <h3>${p.title}</h3>
        <p class="price">${price}</p>
        <p class="tagline">Bestseller · Limited stock</p>
      </div>
    </a>
  `;
}

/**
 * Hero carousel slide.
 */
function slideHTML(p) {
  const href = `./product.html?id=${p.id}`;
  const imageUrl = p.image?.url || "";
  const altText = p.image?.alt || p.title || "Product";

  return `
    <article class="slide">
      <img src="${imageUrl}" alt="${altText}">
      <div class="copy">
        <h2>${p.title}</h2>
        <p>${p.description || ""}</p>
        <div class="cta-row">
          <a class="btn light" href="${href}">Shop now</a>
          <a class="btn ghost" href="${href}">Find out more</a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Carousel wiring: prev/next, dots, autoplay, hover pause.
 */
function wireCarousel() {
  const dots = Array.from(dotsEl.querySelectorAll("button"));
  const hero = document.getElementById("hero-carousel");

  function go(n) {
    idx = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) =>
      d.setAttribute("aria-current", i === idx ? "true" : "false")
    );
  }

  function next() {
    go(idx + 1);
  }

  function prev() {
    go(idx - 1);
  }

  let autoTimer;
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 5000);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  nextBtn?.addEventListener("click", () => {
    next();
    stopAuto();
    startAuto();
  });

  prevBtn?.addEventListener("click", () => {
    prev();
    stopAuto();
    startAuto();
  });

  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      go(i);
      stopAuto();
      startAuto();
    })
  );

  hero?.addEventListener("mouseenter", stopAuto);
  hero?.addEventListener("mouseleave", startAuto);

  startAuto();
}

/**
 * Search handling.
 */
const searchForm = document.querySelector(".site-search");
const searchInput = searchForm?.querySelector("input[name='q']");

if (searchForm && grid && searchInput) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const query = searchInput.value.trim().toLowerCase();

    if (!allProducts.length) return;

    if (!query) {
      renderGrid(allProducts);
      return;
    }

    const filtered = allProducts.filter((p) =>
      p.title.toLowerCase().includes(query)
    );

    if (!filtered.length) {
      grid.innerHTML = "<p>No products match your search.</p>";
      return;
    }

    renderGrid(filtered);
  });
}
