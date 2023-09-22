import {setMaxTime} from './state.js';

function swapButtonActive(textButtons, button){
    textButtons.forEach((btn) => {
        btn.classList.remove("textButton-active");
    });
    button.classList.add("textButton-active");
}

function initializeTimeButton(){
    const textButtons = document.querySelectorAll("#time-option .textButton");
    textButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const timeValue = button.querySelector('span').textContent;
            setMaxTime(timeValue);
            swapButtonActive(textButtons, button);
        });
    });
}
function initializeModeButton(){
    const textButtons = document.querySelectorAll("#mode-option .textButton");
    textButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const mode = button.querySelector('span').parentElement.id;
            switch (mode){
                case "time-mode":
                    break;
                case "endless-mode":
                    break;
                case "secret-mode":
                    break;
                default:
                    break;
            }
            swapButtonActive(textButtons, button);
        });
    });
}
function initializeButton(){
    initializeTimeButton();
    initializeModeButton();
}

export {initializeButton};