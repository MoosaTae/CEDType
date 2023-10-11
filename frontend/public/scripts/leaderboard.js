import { getItems, editItem } from './api.js'
import { name } from './option.js'
/**
 * @typedef {Object} People
 * @property {number} ranking
 * @property {string} name
 * @property {number} score
 * @property {number} wpm
 * @property {number} time
 */
/**
 * @param {People[]} people
 */

let timeop = document.querySelector('#LBtimeOp')
let endlessop = document.querySelector('#LBEndlessOp')
let option = 1
function changeoption() {
    timeop.classList.toggle('selectedLBop')
    endlessop.classList.toggle('selectedLBop')
    if (option == 1) option = 2
    else option = 1
    console.log(option)
    fetchAndDrawTable()
}
function InitLeaderboard() {
    timeop.addEventListener('click', changeoption)
    endlessop.addEventListener('click', changeoption)
    fetchAndDrawTable()
}
InitLeaderboard()
const timeValues = [1, 15, 30, 60];
function drawTable(items) {
    /** @type {HTMLTableSectionElement} */
    const table = document.querySelectorAll('.table')
    // const youtable = document.querySelector("#Yourtable");

    // Clear all elements
    let j=1;
    for(const itable of table){
        itable.innerHTML = ''
        let i=1;
        for (const item of items) {
            if(item.time=timeValues[j-1]){
            const row = table.insertRow()
            row.insertCell().innerText = i.toString()+".";
            i++;
            row.insertCell().innerText = item.name
            row.insertCell().innerText = item.score
            row.insertCell().innerText = item.wpm
            }
            
        }
        j++;
    }
    
    //youtable.innerHTML = "";
    
    
    // const row2 = youtable.insertRow();
    // row2.insertCell().innerText = youitem.ranking;
    // row2.insertCell().innerText = youitem.name;
    // row2.insertCell().innerText = youitem.score;
    // row2.insertCell().innerText = youitem.wpm;
}



export async function fetchAndDrawTable() {

    const items = await getItems(option)
    drawTable(items);
}
//เดะทำ
async function handleCreateItem(name, score, wpm, time,mode) {
    const payload = {
        name: name,
        score: score,
        wpm: wpm,
        time:time,
    }
    await editItem(payload, mode)
    await fetchAndDrawTable()
}

export { InitLeaderboard, handleCreateItem }
