const form = document.getElementById("login-form");
const msg = document.getElementById("login-msg");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("login-email");
    const passInput = document.getElementById("login-password");

    const email = emailInput.value.trim();
    const pass = passInput.value.trim();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

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

    const user = users.find((u) => u.email === email && u.password === pass);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      msg.classList.add("success-text");
      msg.textContent = "Login successful! Redirecting...";

      setTimeout(() => (location.href = "../index.html"), 1200);
    } else {
      msg.classList.add("error-text");
      msg.textContent = "Invalid email or password.";

      emailInput.classList.add("input-error");
      passInput.classList.add("input-error");
    }
  });
}
