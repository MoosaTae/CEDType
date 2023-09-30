import { createItem, deleteItem, getItems } from "./api.js";
/**
 * @typedef {Object} People
 * @property {number} ranking
 * @property {string} name
 * @property {number} score
 * @property {number} wpm
 */
/**
 * @param {People[]} people
 */

export const BACKEND_URL = "http://localhost:3222";
let timeop = document.querySelector("#LBtimeOp");
let endlessop = document.querySelector("#LBEndlessOp");
let option = 1;
function changeoption() {
    timeop.classList.toggle("selectedLBop");
    endlessop.classList.toggle("selectedLBop");
    fetchAndDrawTable();
    if (option == 1) option = 2;
    else option = 1;
}
function InitLeaderboard() {
    timeop.addEventListener("click", changeoption);
    endlessop.addEventListener("click", changeoption);
    fetchAndDrawTable();
}
InitLeaderboard();

function drawTable(items) {
    /** @type {HTMLTableSectionElement} */
    const table = document.querySelector("#LBtable");

    // Clear all elements
    table.innerHTML = "";
    let temp = 0;
    for (const item of items) {

        const row = table.insertRow(temp);
        temp++;
        row.insertCell().innerText = item.item;
        row.insertCell().innerText = item.item;
        row.insertCell().innerText = item.name;
        row.insertCell().innerText = item.price;

        const button = document.createElement("button");
        button.addEventListener("click", () => handleDelete(item._id));
        button.innerText = "ลบ";

        row.insertCell().appendChild(button);
    }
}

export async function fetchAndDrawTable() {
    const items = await getItems(option);

    drawTable(items);
}
//เดะทำ
export async function handleCreateItem() {
    /** @type {HTMLInputElement} */
    const itemToAdd = document.getElementById("item-to-add");

    /** @type {HTMLSelectElement} */
    const nameToAdd = document.getElementById("name-to-add");

    /** @type {HTMLInputElement} */
    const priceToAdd = document.getElementById("price-to-add");

    const payload = {
        item: itemToAdd.value,
        name: nameToAdd.value,
        price: priceToAdd.value,
    };

    await createItem(payload, option);
    await fetchAndDrawTable();

    itemToAdd.value = "";
    nameToAdd.value = "0";
    priceToAdd.value = "";
}

export { InitLeaderboard };