import {setMaxTime} from './state.js';

function initializeTimeButtonHandlers(){
    const textButtons = document.querySelectorAll(".textButton");
    textButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const timeValue = button.querySelector('span').textContent;
            setMaxTime(timeValue);
            console.log(`Selected time: ${timeValue}`);

            textButtons.forEach((btn) => {
                btn.classList.remove("textButton-active");
            });

            button.classList.add("textButton-active");
        });
    });
}
export {initializeTimeButtonHandlers};