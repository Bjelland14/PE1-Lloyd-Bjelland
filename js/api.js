export const BASE= "https://v2.api.noroff.dev";
const shop = `$ {BASE}/online-shop`;

export async function getProducts({ limit = 12, page = 1 } = {}) {
    const qs = new URLSearchParams ({  limit, page }). toString();
    const res = await fetch (`$ {SHOP}?${qs}`);   
    if (!res.ok) throw new Error ("Failed to fetch products");
    return res.json();
}