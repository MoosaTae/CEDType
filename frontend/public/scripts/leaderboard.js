let timeop = document.querySelector("#LBtimeOp");
let endlessop = document.querySelector("#LBEndlessOp");
function changeoption() {
    timeop.classList.toggle("selectedLBop");
    endlessop.classList.toggle("selectedLBop");
}
function InitLeaderboard() {
    timeop.addEventListener("click", changeoption);
    endlessop.addEventListener("click", changeoption);
}
InitLeaderboard();

export { InitLeaderboard };