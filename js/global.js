export function updateCartCount() {
  const el = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  if (el) el.textContent = total > 0 ? `(${total})` : "";
}

export function updateAuthButtons() {
  const nav = document.querySelector(".nav-links");
  if (!nav) return;

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  const oldLogout = nav.querySelector("#logout-btn");
  const oldWelcome = nav.querySelector("#welcome-msg");
  if (oldLogout) oldLogout.remove();
  if (oldWelcome) oldWelcome.remove();

  if (loggedInUser) {
    const welcome = document.createElement("span");
    welcome.id = "welcome-msg";
    welcome.textContent = `👋 Welcome, ${loggedInUser.name || "User"}`;

    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.textContent = "Logout";
    logoutBtn.className = "nav-btn";

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      alert("You have been logged out.");
      location.href = "./index.html";
    });

    nav.appendChild(welcome);
    nav.appendChild(logoutBtn);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateAuthButtons();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  const banner = document.getElementById("welcome-banner");

  if (banner && loggedInUser) {
    banner.textContent = `Welcome back, ${loggedInUser.name}!`;
  }
});
