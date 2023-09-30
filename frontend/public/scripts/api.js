import { BACKEND_URL } from "./leaderboard.js";

/** @typedef {import("./leaderboard.js").People} People */

export async function getItems(which) {
  /** @type {People[]} */
  const items = await fetch(`${BACKEND_URL}/leaderboard${which}`).then((r) => r.json());


  return items;
}
export async function getyouItems(which, name) {
  /** @type {People[]} */

  const youitems = await fetch(`${BACKEND_URL}/leaderboard${which}`, { method: "GET", body: JSON.stringify(name), }).then((r) => r.json());

  return youitems;
}
/**
 * @param {People} item
 */
//might be unimportant
/*export async function createItem(item, which) {
  await fetch(`${BACKEND_URL}/leaderboard${which}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}
*/
/**
 * @param {string} id
 * @param {People} item
 */

export async function editItem(item, which) {
  await fetch(`${BACKEND_URL}/leaderboard${which}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

