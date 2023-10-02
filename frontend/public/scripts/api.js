const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:3222`;

/** @typedef {import("./leaderboard.js").People} People */
export async function getItems(which) {
  /** @type {People[]} */
  const items = await fetch(`${BACKEND_URL}/leaderboard${which}`).then((r) => r.json());


  return items;
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

