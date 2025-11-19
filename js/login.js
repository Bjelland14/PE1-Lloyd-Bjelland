const form = document.getElementById("login-form");
const msg = document.getElementById("login-msg");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value.trim();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find((u) => u.email === email && u.password === pass);

    msg.className = "";
    msg.textContent = "";

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      
      msg.classList.add("success-text");
      msg.textContent = "Login successful! Redirecting...";

      setTimeout(() => (location.href = "../index.html"), 1200);
    } else {
      msg.classList.add("error-text");
      msg.textContent = "Invalid email or password.";
    }
  });
}
