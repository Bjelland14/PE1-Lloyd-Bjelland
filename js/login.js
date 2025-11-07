const form = document.getElementById("login-form");
const msg = document.getElementById("login-msg");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value.trim();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find((u) => u.email === email && u.password === pass);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      msg.style.color = "green";
      msg.textContent = "Login successful! Redirecting...";
      setTimeout(() => (location.href = "../index.html"), 1200);
    } else {
      msg.style.color = "red";
      msg.textContent = "Invalid email or password.";
    }
  });
}
