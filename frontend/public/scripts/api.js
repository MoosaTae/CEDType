const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:3222`

/** @typedef {import("./leaderboard.js").People} People */
export async function getItems(which) {
    try {
        const respone = await fetch(`${BACKEND_URL}/leaderboard/${which}`)
        if (!respone.ok) {
            throw Error(respone.statusText)
        }
        const items = await respone.json()
        return items
    } catch (err) {
        console.log(err)
    }
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
    try {
        await fetch(`${BACKEND_URL}/leaderboard/${which}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        })
    } catch (err) {
        console.log(err)
    }
}
