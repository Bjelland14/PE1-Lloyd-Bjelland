import { registerAccount } from "./api.js";

const form = document.getElementById("register-form");
const msg = document.getElementById("register-msg");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("reg-name");
    const emailInput = document.getElementById("reg-email");
    const passInput = document.getElementById("reg-password");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    msg.className = "form-msg";
    msg.textContent = "";
    nameInput.classList.remove("input-error");
    emailInput.classList.remove("input-error");
    passInput.classList.remove("input-error");

    if (!name || !email || !password) {
      msg.classList.add("error-text");
      msg.textContent = "Please fill in all fields.";
      if (!name) nameInput.classList.add("input-error");
      if (!email) emailInput.classList.add("input-error");
      if (!password) passInput.classList.add("input-error");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

    try {
      await registerAccount({ name, email, password });

      msg.classList.add("success-text");
      msg.textContent = "Account created! You can now log in.";

      setTimeout(() => {
        location.href = "./login.html";
      }, 1000);
    } catch (error) {
      console.error("Register error:", error);
      msg.classList.add("error-text");
      msg.textContent =
        error.message || "Registration failed. Please try again.";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
