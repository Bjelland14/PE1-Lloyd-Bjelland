import { getProducts } from "./api.js";

const grid = document.getElementById("products-grid");
const statusEl = document.getElementById("status");

const track = document.getElementById("carousel-track");
const dotsEl = document.getElementById("carousel-dots");
const prevBtn = document.querySelector(".carousel .prev");
const nextBtn = document.querySelector(".carousel .next");

const featuredGrid = document.getElementById("featured-grid");
const categoryRow = document.getElementById("category-row");

let idx = 0;
let slides = [];

(async () => {
  try {
    const { data: items } = await getProducts({ limit: 12 });

    const heroProducts = items.slice(0, 3);
    const hotProducts = items.slice(3, 7);
    const restProducts = items.slice(7);

    if (featuredGrid && hotProducts.length) {
      featuredGrid.innerHTML = hotProducts.map(featuredCard).join("");
    }

    
    if (grid) {
      grid.innerHTML = restProducts.map(card).join("");
    }

    
    if (track && dotsEl && heroProducts.length) {
      track.innerHTML = heroProducts.map(slideHTML).join("");

      dotsEl.innerHTML = heroProducts
        .map(
          (_p, i) =>
            `<button type="button" ${
              i === 0 ? 'aria-current="true"' : ""
            } aria-label="Go to slide ${i + 1}"></button>`
        )
        .join("");

      slides = Array.from(track.children);
      wireCarousel();
    }

    
    if (categoryRow) {
      categoryRow.innerHTML = `
        <article class="category-card">
          <h3>Tech &amp; Gadgets</h3>
          <p>Headphones, speakers, accessories and more.</p>
        </article>
        <article class="category-card">
          <h3>Home &amp; Lifestyle</h3>
          <p>Decor, lighting and everyday favourites.</p>
        </article>
        <article class="category-card">
          <h3>Beauty &amp; Care</h3>
          <p>Popular self-care and wellness picks.</p>
        </article>
        <article class="category-card">
          <h3>On Sale</h3>
          <p>Products with discounted prices.</p>
        </article>
      `;
    }

    if (statusEl) statusEl.textContent = "";
  } catch (err) {
    console.error(err);
    if (statusEl) {
      statusEl.textContent = err.message || "Something went wrong.";
    }
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
  const imgUrl = p.image?.url || "./assets/placeholder.png";

  return `
    <article class="slide">
      <div class="copy">
        <p class="slide-tagline">Featured</p>
        <h2>${p.title}</h2>
        <p>${p.description || ""}</p>
        <div class="cta-row">
          <a class="btn light" href="${href}">Shop now</a>
          <a class="btn ghost" href="${href}">Find out more</a>
        </div>
      </div>
      <img src="${imgUrl}" alt="${p.image?.alt || p.title}">
    </article>
  `;
}


function wireCarousel() {
  const dots = Array.from(dotsEl.querySelectorAll("button"));
  const hero = document.getElementById("hero-carousel");

  if (!slides.length || !dots.length || !track) return;

  function go(n) {
    idx = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;

    dots.forEach((d, i) => {
      if (i === idx) {
        d.setAttribute("aria-current", "true");
      } else {
        d.removeAttribute("aria-current");
      }
    });
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

  go(0);
  startAuto();
}
