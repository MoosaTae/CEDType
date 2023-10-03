import { getItems, editItem } from "./api.js";
import { name } from "./option.js";
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

let timeop = document.querySelector("#LBtimeOp");
let endlessop = document.querySelector("#LBEndlessOp");
let option = 1;
function changeoption() {
  timeop.classList.toggle("selectedLBop");
  endlessop.classList.toggle("selectedLBop");
  if (option == 1) option = 2;
  else option = 1;
  console.log(option);
  fetchAndDrawTable();
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
  // const youtable = document.querySelector("#Yourtable");

  // Clear all elements
  table.innerHTML = "";
  //youtable.innerHTML = "";
  console.log(items);
  for (const item of items) {
    const row = table.insertRow();
    row.insertCell().innerText = item.ranking;
    row.insertCell().innerText = item.name;
    row.insertCell().innerText = item.score;
    row.insertCell().innerText = item.wpm;
  }
  // const row2 = youtable.insertRow();
  // row2.insertCell().innerText = youitem.ranking;
  // row2.insertCell().innerText = youitem.name;
  // row2.insertCell().innerText = youitem.score;
  // row2.insertCell().innerText = youitem.wpm;
}

export async function fetchAndDrawTable() {
  const items = await getItems(option);
  console.log(items);
  drawTable(items);
}
//เดะทำ
async function handleCreateItem(name, score, wpm, mode) {
  const payload = {
    name: name,
    score: score,
    wpm: wpm,
  };
  await editItem(payload, mode);
  await fetchAndDrawTable();
}

export { InitLeaderboard, handleCreateItem };
