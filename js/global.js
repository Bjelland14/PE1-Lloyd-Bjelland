function seedDemoUser() {
  try {
    const stored = localStorage.getItem("users");
    const users = stored ? JSON.parse(stored) : [];

    const exists = users.some((u) => u.email === "admin@stud.noroff.no");
    if (exists) return;

    users.push({
      name: "Store Owner",
      email: "admin@stud.noroff.no",
      password: "Admin123",
    });

    localStorage.setItem("users", JSON.stringify(users));
  } catch (error) {
    console.error("Failed to seed demo user:", error);
  }
}

function safeParse(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error(`Failed to parse localStorage key "${key}":`, e);
    return null;
  }
}

export function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const cart = safeParse("cart") || [];
  const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  el.textContent = total > 0 ? `(${total})` : "";
}

export function updateAuthButtons() {
  const nav = document.querySelector(".nav-links");
  if (!nav) return;

  const loggedInUser = safeParse("loggedInUser");

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

      if (location.pathname.includes("/account/")) {
        location.href = "../index.html";
      } else {
        location.href = "./index.html";
      }
    });

    nav.appendChild(welcome);
    nav.appendChild(logoutBtn);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  seedDemoUser();

  updateCartCount();
  updateAuthButtons();

  const loggedInUser = safeParse("loggedInUser");
  const banner = document.getElementById("welcome-banner");

  if (banner && loggedInUser) {
    banner.textContent = `Welcome back, ${loggedInUser.name}!`;
  }
});
