import { login } from "./api.js";

const form = document.getElementById("login-form");
const msg = document.getElementById("login-msg");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("login-email");
    const passInput = document.getElementById("login-password");

    const email = emailInput.value.trim();
    const pass = passInput.value.trim();

    msg.className = "form-msg";
    msg.textContent = "";
    emailInput.classList.remove("input-error");
    passInput.classList.remove("input-error");

    if (!email || !pass) {
      msg.classList.add("error-text");
      msg.textContent = "Please fill in all fields.";
      if (!email) emailInput.classList.add("input-error");
      if (!pass) passInput.classList.add("input-error");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const result = await login({ email, password: pass });

      const userData = result.data || result;

      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      msg.classList.add("success-text");
      msg.textContent = "Login successful! Redirecting...";

      setTimeout(() => {
        location.href = "../index.html";
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      msg.classList.add("error-text");
      msg.textContent =
        error.message || "Login failed. Please check your details.";
      emailInput.classList.add("input-error");
      passInput.classList.add("input-error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
