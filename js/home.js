import { getProducts } from "./api.js";

const grid = document.getElementById("products-grid");
const statusEl = document.getElementById("status");

const track = document.getElementById("carousel-track");
const dotsEl = document.getElementById("carousel-dots");
const prevBtn = document.querySelector(".carousel .prev");
const nextBtn = document.querySelector(".carousel .next");

let idx = 0, slides = [], timer;

(async () => {
  try {
    const [{ data: items }, { data: featured }] = await Promise.all([
      getProducts({ limit: 12 }),
      getProducts({ limit: 3 })
    ]);

    if (grid) grid.innerHTML = items.map(card).join("");

    if (track && dotsEl) {
      track.innerHTML = featured.map(slideHTML).join("");
      dotsEl.innerHTML = featured
        .map((_, i) => `<button type="button" ${i === 0 ? 'aria-current="true"' : ""} aria-label="Go to slide ${i + 1}"></button>`)
        .join("");
      slides = Array.from(track.children);
      wireCarousel();
    }

    if (statusEl) statusEl.textContent = "";
  } catch (err) {
    if (statusEl) statusEl.textContent = err.message || "Something went wrong.";
    console.error(err);
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
    dots.forEach((d, i) => d.setAttribute("aria-current", i === idx ? "true" : "false"));
  }
  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }
  function start() { stop(); timer = setInterval(next, 5000); }
  function stop() { if (timer) clearInterval(timer); }

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);
  dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
  if (hero) {
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
  }
  start();
}
