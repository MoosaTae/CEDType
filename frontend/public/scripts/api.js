import { BACKEND_URL } from "./leaderboard.js";

/** @typedef {import("./leaderboard.js").People} People */

export async function getItems(which) {
  /** @type {People[]} */
  const items = await fetch(`${BACKEND_URL}/leaderboard${which}`).then((r) => r.json());
  //ต้อง get ตัวเองด้วย
  return items;
}

/**
 * @param {People} item
 */
export async function createItem(item, which) {
  await fetch(`${BACKEND_URL}/leaderboard${which}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

/**
 * @param {string} id
 * @param {People} item
 */

//ต้อง find ก่อน
/*export async function editItem(id, item) {
  await fetch(`${BACKEND_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}*/

