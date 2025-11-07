import { getProducts } from "./api.js";

const grid = document.getElementById("products-grid");
const statusEl = document.getElementById("status");

const track = document.getElementById("carousel-track");
const dotsEl = document.getElementById("carousel-dots");
const prevBtn = document.querySelector(".carousel .prev");
const nextBtn = document.querySelector(".carousel .next");

let idx = 0;
let slides = [];

/* HOVED-LOAD */
(async () => {
  try {
    // Hent produkter + featured samtidig
    const [{ data: items }, { data: featured }] = await Promise.all([
      getProducts({ limit: 12 }),
      getProducts({ limit: 3 })
    ]);

    // Fyll produkt-grid
    if (grid) {
      grid.innerHTML = items.map(card).join("");
    }

    // Bygg hero-karusell
    if (track && dotsEl && featured.length) {
      track.innerHTML = featured.map(slideHTML).join("");

      dotsEl.innerHTML = featured
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

/* --- RENDER-FUNKSJONER --- */

function card(p) {
  const price =
    p.discountedPrice && p.discountedPrice < p.price
      ? `<s>${p.price.toFixed(2)} NOK</s> <strong>${p.discountedPrice.toFixed(
          2
        )} NOK</strong>`
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

/* --- KARUSELL --- */

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
