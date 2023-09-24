import { setMaxTime, changeMode } from './state.js';

function swapButtonActive(textButtons, button) {
    textButtons.forEach((btn) => {
        btn.classList.remove("textButton-active");
    });
    button.classList.add("textButton-active");
}

function initializeTimeButton() {
    const textButtons = document.querySelectorAll("#time-option .textButton");
    textButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const timeValue = button.querySelector('span').textContent;
            setMaxTime(timeValue);
            swapButtonActive(textButtons, button);
        });
    });
}

function initializeModeButton() {
    const textButtons = document.querySelectorAll("#mode-option .textButton");
    textButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const mode = button.querySelector('span').parentElement.id;
            switch (mode) {
                case "time-mode":
                    changeMode("time-mode");
                    break;
                case "endless-mode":
                    game_mode = "endless-mode";
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
let NameSS = document.querySelector(".NameS");
function initializeNameInputButton() {
    document.querySelector("#loginB").addEventListener("click", () => {
        NameSS.classList.toggle("show");

        document.addEventListener("keydown", () => document.querySelector("#name-input").focus());
    });
}
function initializeButton() {
    initializeTimeButton();
    initializeModeButton();
    initializeNameInputButton()

    document.querySelector("#namesummitbutton").addEventListener("click", () => {
        document.querySelector("#loginS").innerHTML = document.querySelector("#name-input").value;
        NameSS.classList.toggle("show");
        document.querySelector("#loginB").style.visibility = "hidden";

    });
}

export { initializeButton };