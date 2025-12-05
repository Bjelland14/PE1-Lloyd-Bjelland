const form = document.getElementById("register-form");
const msg = document.getElementById("register-msg");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-password").value.trim();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    msg.className = "form-msg";
    msg.textContent = "";

    if (!name || !email || !pass) {
      msg.classList.add("error-text");
      msg.textContent = "Please fill in all fields.";
      return;
    }

    if (users.find((u) => u.email === email)) {
      msg.classList.add("error-text");
      msg.textContent = "Email already registered.";
      return;
    }

    users.push({ name, email, password: pass });
    localStorage.setItem("users", JSON.stringify(users));

    msg.classList.add("success-text");
    msg.textContent = "Registration successful! Redirecting...";

    setTimeout(() => (location.href = "./login.html"), 1200);
  });
}
