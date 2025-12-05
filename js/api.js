// api.js
export const BASE = "https://v2.api.noroff.dev";
const SHOP = `${BASE}/online-shop`;

/**
 * Get a page of products.
 */
export async function getProducts({ limit = 12, page = 1 } = {}) {
  const qs = new URLSearchParams({ limit, page }).toString();
  const res = await fetch(`${SHOP}?${qs}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch products (status ${res.status})`);
  }

  return res.json(); // { data, meta }
}

/**
 * Get a single product by id.
 */
export async function getProduct(id) {
  const res = await fetch(`${SHOP}/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch product (status ${res.status})`);
  }

  return res.json(); // { data }
}

/**
 * Register a new user using Noroff auth API.
 */
export async function registerAccount({ name, email, password }) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json(); // { data: { ...user } }
}

/**
 * Login a user using Noroff auth API.
 */
export async function login({ email, password }) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json(); // { data: { ...user } }
}
