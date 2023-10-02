import { words } from "./items.js";
import { name } from "./option.js";
import { handleCreateItem } from "./leaderboard.js";

const typingText = document.querySelector(".typing-text");
const inpField = document.querySelector("#input-container");
const timeTag = document.querySelector("#time");
//const mistakeTag = document.querySelector(".mistake span")
const wpmTag = document.querySelector("#wpm");
const scoreTag = document.querySelector("#score");
const timeFrequency = 10; // millisecond

let timer;
let wpm;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = 0;
let misplay = 0;
let score = 0;
let multiplier = 1;
let timepass = 0;
let max_length = 10;
let min_length = 5;
let game_mode = "endless-mode";

function generateRandomParagraph() {
  const paragraphLength =
    Math.floor(Math.random() * (max_length - min_length + 1)) + min_length;
  const paragraph = [];

  for (let i = 0; i < paragraphLength; i++) {
    const randomWordIndex = Math.floor(Math.random() * words.length);
    paragraph.push(words[randomWordIndex]);
  }
  return paragraph.join(" ");
}

function addParagraph() {
  if (game_mode == "endless-mode") {
    let charactersIndex = Math.floor(Math.random() * words.length);
    words[charactersIndex].split("").forEach((char) => {
      let span = `<span>${char}</span>`;
      typingText.innerHTML += span;
    });
  } else if (game_mode == "time-mode") {
    let paragraph = generateRandomParagraph();
    for (let i = 0; i < paragraph.length; i++) {
      let span = `<span>${paragraph[i]}</span>`;
      typingText.innerHTML += span;
    }
  }
  // typingText.querySelector("span").classList.add("active");
}
function resetWord() {
  typingText.innerHTML = "";
  inpField.value = "";
  charIndex = 0;
  addParagraph();
}

// randomly load a paragraph from the words
function loadParagraph() {
  resetWord();
  document.addEventListener("keydown", () => inpField.focus());
  typingText.addEventListener("click", () => inpField.focus());
}

function resetGame() {
  loadParagraph();
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  inpField.value = "";
  timeTag.innerText = timeLeft;
  wpmTag.innerText = 0;
  scoreTag.innerText = 0;
  score = 0;
  multiplier = 1;
  timepass = 0;
}

function initTyping() {
  let characters = typingText.querySelectorAll("span");
  let typedChar = inpField.value.split("")[charIndex];
  if (timeLeft > 0) {
    // start timer
    if (!isTyping) {
      timer = setInterval(initTimer, timeFrequency);
      isTyping = true;
    }
    // delete case
    if (typedChar == null) {
      // is it start of the paragraph?
      if (charIndex > 0) {
        charIndex--;
        if (characters[charIndex].classList.contains("incorrect")) {
          misplay = 0;
        }
        characters[charIndex].classList.remove("correct", "incorrect");
      }
    }
    // normal case
    else {
      if (characters[charIndex].innerText == typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        misplay = 1;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
      if (charIndex == characters.length) {
        CheckWord();
      }
    }
  } else {
    clearInterval(timer);
    inpField.value = "";
  }
}

function CheckWord() {
  if (misplay == 0) {
    score++;
    scoreTag.innerText = score;
    timeLeft += 2.5;
  } else {
    timeLeft -= 5;
  }
  resetWord();
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft -= 0.01 * multiplier;
    timepass += 0.01;
    multiplier = Math.ceil(timepass / 30);
    if (timeLeft < 0) timeLeft = 0;
    timeTag.innerText = timeLeft;
    wpm = Math.round((score * 60) / timepass);
    wpmTag.innerText = wpm;
  } else {
    clearInterval(timer);
    //เมื่อ create item ไป handle
    if (name != "") {
      if (game_mode == "endless-mode") handleCreateItem(name, score, wpm, 2);
      else handleCreateItem(name, score, wpm, 1);
    }
  }
}

function setMaxTime(newTime) {
  maxTime = newTime;
  resetGame();
}

function changeMode(mode) {
  game_mode = mode;
  resetGame();
}

export {
  loadParagraph,
  initTyping,
  resetWord,
  resetGame,
  maxTime,
  setMaxTime,
  initTimer,
  changeMode,
};
