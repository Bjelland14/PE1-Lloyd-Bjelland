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

function renderGrid(products) {
  if (!grid) return;
  grid.innerHTML = products.map(card).join("");
}

(async () => {
  try {
    const { data: items } = await getProducts({ limit: 12 });

    allProducts = items; 

    const heroProducts = items.slice(0, 3);
    const hotProducts = items.slice(3, 7);
    const restProducts = items.slice(7);

    if (featuredGrid && hotProducts.length) {
      featuredGrid.innerHTML = hotProducts.map(featuredCard).join("");
    }

    renderGrid(restProducts);

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

function formatPrice(p) {
  const value =
    p.discountedPrice && p.discountedPrice < p.price
      ? p.discountedPrice
      : p.price;

  return `<strong>${value.toFixed(2)} NOK</strong>`;
}

function card(p) {
  const price = formatPrice(p);

  return `
    <a class="card" href="./product.html?id=${p.id}">
      <img src="${p.image?.url}" alt="${p.image?.alt || p.title}">
      <h3>${p.title}</h3>
      <p>${price}</p>
    </a>
  `;
}

function featuredCard(p) {
  const price = formatPrice(p);

  return `
    <a class="card featured-card" href="./product.html?id=${p.id}">
      <img src="${p.image?.url}" alt="${p.image?.alt || p.title}">
      <div class="featured-info">
        <h3>${p.title}</h3>
        <p class="price">${price}</p>
        <p class="tagline">Bestseller · Limited stock</p>
      </div>
    </a>
  `;
}

function slideHTML(p) {
  const href = `./product.html?id=${p.id}`;
  return `
    <article class="slide">
      <img src="${p.image?.url}" alt="${p.image?.alt || p.title}">
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

const searchForm = document.querySelector(".site-search");
const searchInput = searchForm?.querySelector("input[name='q']");

if (searchForm && grid) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const query = searchInput.value.trim().toLowerCase();

    if (!allProducts.length) return;

    if (!query) {
      renderGrid(allProducts.slice(7));
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
