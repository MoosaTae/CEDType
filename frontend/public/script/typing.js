import { loadParagraph, initTyping, resetGame } from "./state.js";
import { initializeTimeButtonHandlers } from "./option.js";

const inpField = document.querySelector("#input-container");
const tryAgainBtn = document.querySelector("#restart-button");

function gameStart() {
    initializeTimeButtonHandlers();
    loadParagraph();
    inpField.addEventListener("input", initTyping);
    tryAgainBtn.addEventListener("click", resetGame);
    inpField.addEventListener("keydown", (e) => {
    if (e.keyCode == 9) {
        resetGame();
    }
    });
    tryAgainBtn.addEventListener("keydown", (e) => {
    if (e.keyCode == 9) {
        resetGame();
    }
    });
}
export {gameStart};