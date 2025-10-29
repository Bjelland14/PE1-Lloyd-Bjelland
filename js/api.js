export const BASE = "https://v2.api.noroff.dev";
const SHOP = `${BASE}/online-shop`;

export async function getProducts({ limit = 12, page = 1 } = {}) {
  const qs = new URLSearchParams({ limit, page }).toString();
  const res = await fetch(`${SHOP}?${qs}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${SHOP}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}
