import { loadParagraph, initTyping, resetGame } from './state.js'
import { initializeButton } from './option.js'
import { InitLeaderboard } from './leaderboard.js'

let which = 0;
const inpField = document.querySelector('#input-container')
const tryAgainBtn = document.querySelector('#restart-button')
const timeGame = document.querySelector('#timegame')
function TabReset(e) {
    if (e.code == 'Tab') {
        e.preventDefault() // Prevent the default tab key behavior
        resetGame()
    }
}
function gameStart() {
    initializeButton()
    InitLeaderboard()
    loadParagraph()

    function InitMainGame(ev) {
      console.log("Main");
    inpField.addEventListener('keydown', TabReset)
    tryAgainBtn.addEventListener('keydown', TabReset)
    timeGame.addEventListener('keydown', TabReset)

    initTyping();
    tryAgainBtn.addEventListener('click', resetGame)
    //   focus for endless mode
    inpField.addEventListener('focus', () => {
        const endlessGame = document.querySelector('#endlessgame')
        endlessGame.classList.add('focused')
    })
    inpField.addEventListener('blur', () => {
        const endlessGame = document.querySelector('#endlessgame')
        endlessGame.classList.remove('focused')
    })
  }
  document.querySelector('#input-container').addEventListener('click',()=> {which = 5 ;});



  const tKey = 'qwertyuiop'
const tChar = tKey.split('');
const tCount = tChar.length;
let tTime = 30 * 1000;
let tTimer = null;
let tGameStart = null;

function addClass(el, name) {
    el.classList.add(name);
} //reuseable

function removeClass(el, name) {
    el.classList.remove(name);
} //reuseable

function formatTWord(word) {
    return `<div class = "Tword"><span class = "Tletter">${word.split('').join('</span><span class = "Tletter">')}</span></div>`;
} //reuseable

//Top ROWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
function randomTopRowWord() {
    const maxWordLength = 3;
    const wordLength = Math.ceil(Math.random() * maxWordLength);
    let randomWord = '';

    for (let i = 0; i < wordLength; i++) {
        const randomIndex = Math.floor(Math.random() * tCount);
        randomWord += tChar[randomIndex];
    }

    return randomWord;
}


function newGameTopRow() {
    document.getElementById('tChar').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('tChar').innerHTML += formatTWord(randomTopRowWord());
    }
    addClass(document.querySelector('.Tword'), 'current-topRow');
    addClass(document.querySelector('.Tletter'), 'current-topRow');
    document.querySelector('main').addEventListener('keydown', (ev) => {
        if (which == 5) InitMainGame(ev)
        else if (which == 1) InitTopRowGame(ev)
        else if (which == 2) InitHomeRowGame(ev)
        else if (which == 3) InitBotRowGame(ev)
    });
    tTimer = null;
    removeClass(document.getElementById('topRow-game'), 'over');
    document.getElementById('tChar').style.marginTop = 0;
}

function getWpmTopRow() {
    const tChar = [...document.querySelectorAll('.Tword')];
    const lastTypedWord = document.querySelector('.Tword.current-topRow');
    const lastTypedWordIndex = tChar.indexOf(lastTypedWord);
    const typedWords = tChar.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect-topRow'));
        const correctLetters = letters.filter(letter => letter.classList.contains('correct-topRow'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / tTime * 60000;
}

function gameOverTopRow() {
    clearInterval(tTimer);
    addClass(document.getElementById('topRow-game'), 'over');
    const result = getWpmTopRow();
    tGameStart = null;
}


document.getElementById('topRow-try-again').addEventListener('click', () => {
    gameOverTopRow();
    newGameTopRow();
    resetCursorT();
});

function resetCursorT() {
    const cursor_toprow = document.getElementById('topRow-cursor');
    cursor_toprow.style.top = document.querySelector('.Tletter.current-topRow').getBoundingClientRect().top + 4 + 'px';
    cursor_toprow.style.left = document.querySelector('.Tletter.current-topRow').getBoundingClientRect().left + 'px';
}

newGameTopRow();
resetCursorT();
function InitTopRowGame(ev) {
    const key = ev.key;
    const currentWord = document.querySelector('.Tword.current-topRow');
    const currentLetter = document.querySelector('.Tletter.current-topRow');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    const firstWord = document.querySelector('#tChar').firstChild;
    const isExtra = currentWord.lastChild.classList.contains('extra');

    if (document.querySelector('#topRow-game.over')) {
        return;
    }

    console.log(key, expected);



    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct-topRow' : 'incorrect-topRow');
            removeClass(currentLetter, 'current-topRow');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current-topRow');
            }
        } else {
            if (currentWord.childElementCount < 20) {
                const incorrectLetter = document.createElement('span');
                incorrectLetter.innerHTML = key;
                incorrectLetter.className = 'Tletter incorrect-topRow extra';
                currentWord.appendChild(incorrectLetter);
            }
        }
    }

    if (isSpace) {
        ev.preventDefault();
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.Tword.current-topRow .Tletter:not(.correct-topRow)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect-topRow');
            });
        }
        removeClass(currentWord, 'current-topRow');
        addClass(currentWord.nextSibling, 'current-topRow');
        if (currentLetter) {
            removeClass(currentLetter, 'current-topRow');
        }
        addClass(currentWord.nextSibling.firstChild, 'current-topRow');
        const invalidWord = [...currentWord.childNodes];
        for (let i = 0; i < invalidWord.length; i++) {
            if (invalidWord[i].classList.contains('incorrect-topRow')) {
                addClass(currentWord, 'incorrect-topRow');
                break;
            }
        }
    }

    if (isBackspace) {
        if (currentLetter && isFirstLetter && currentWord !== firstWord) {
            removeClass(currentWord, 'current-topRow');
            addClass(currentWord.previousSibling, 'current-topRow');
            removeClass(currentLetter, 'current-topRow');
            removeClass(currentWord.previousSibling, 'incorrect-topRow');
        }
        if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current-topRow');
            addClass(currentLetter.previousSibling, 'current-topRow');
            removeClass(currentLetter.previousSibling, 'incorrect-topRow');
            removeClass(currentLetter.previousSibling, 'correct-topRow');
        }
        if (!currentLetter) {
            addClass(currentWord.lastChild, 'current-topRow');
            removeClass(currentWord.lastChild, 'incorrect-topRow');
            removeClass(currentWord.lastChild, 'correct-topRow');
        }
        if (isExtra) {
            currentWord.lastChild.remove();
        }
    }

    // move lines
    if (currentWord.getBoundingClientRect().top > 560) {
        const tChar = document.getElementById('tChar');
        const margin = parseInt(tChar.style.marginTop || '0px');
        tChar.style.marginTop = (margin - 35) + 'px';
    }

    // move cursor
    const nextLetter = document.querySelector('.Tletter.current-topRow');
    const nextWord = document.querySelector('.Tword.current-topRow');
    const cursor_toprow = document.getElementById('topRow-cursor');
    cursor_toprow.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px';
    cursor_toprow.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
}
document.querySelector('#topRow-game').addEventListener('click', () => { which = 1; });

//HOME ROWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

const hKey = 'asdfghjkl;'
const hChar = hKey.split('');
const hCount = hChar.length;
let hTime = 30 * 1000;
let hTimer = null;
let hGameStart = null;
function formatHWord(word) {
    return `<div class = "Hword"><span class = "Hletter">${word.split('').join('</span><span class = "Hletter">')}</span></div>`;
}
function randomhomeRowWord() {
    const maxWordLength = 3;
    const wordLength = Math.ceil(Math.random() * maxWordLength);
    let randomWord = '';

    for (let i = 0; i < wordLength; i++) {
        const randomIndex = Math.floor(Math.random() * hCount);
        randomWord += hChar[randomIndex];
    }

    return randomWord;
}


function newGamehomeRow() {
    document.getElementById('hChar').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('hChar').innerHTML += formatHWord(randomhomeRowWord());
    }
    addClass(document.querySelector('.Hword'), 'current-homeRow');
    addClass(document.querySelector('.Hletter'), 'current-homeRow');
    hTimer = null;
    removeClass(document.getElementById('homeRow-game'), 'over');
    document.getElementById('hChar').style.marginTop = 0;
}

function getWpmhomeRow() {
    const hChar = [...document.querySelectorAll('.Hword')];
    const lastTypedWord = document.querySelector('.Hword.current-homeRow');
    const lastTypedWordIndex = hChar.indexOf(lastTypedWord);
    const typedWords = hChar.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect-homeRow'));
        const correctLetters = letters.filter(letter => letter.classList.contains('correct-homeRow'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / hTime * 60000;
}

function gameOverhomeRow() {
    clearInterval(hTimer);
    addClass(document.getElementById('homeRow-game'), 'over');
    const result = getWpmhomeRow();
    hGameStart = null;
}

document.getElementById('homeRow-try-again').addEventListener('click', () => {
    gameOverhomeRow();
    newGamehomeRow();
    resetCursorH();
});

function resetCursorH() {
    const cursor_homeRow = document.getElementById('homeRow-cursor');
    cursor_homeRow.style.top = document.querySelector('.Hletter.current-homeRow').getBoundingClientRect().top + 4 + 'px';
    cursor_homeRow.style.left = document.querySelector('.Hletter.current-homeRow').getBoundingClientRect().left + 'px';
}

newGamehomeRow();
resetCursorH();

function InitHomeRowGame(ev) {
    const key = ev.key;
    const currentWord = document.querySelector('.Hword.current-homeRow');
    const currentLetter = document.querySelector('.Hletter.current-homeRow');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    const firstWord = document.querySelector('#hChar').firstChild;
    const isExtra = currentWord.lastChild.classList.contains('extra');

    if (document.querySelector('#homeRow-game.over')) {
        return;
    }

    console.log(key, expected);



    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct-homeRow' : 'incorrect-homeRow');
            removeClass(currentLetter, 'current-homeRow');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current-homeRow');
            }
        } else {
            if (currentWord.childElementCount < 20) {
                const incorrectLetter = document.createElement('span');
                incorrectLetter.innerHTML = key;
                incorrectLetter.className = 'Hletter incorrect-homeRow extra';
                currentWord.appendChild(incorrectLetter);
            }
        }
    }

    if (isSpace) {
        ev.preventDefault();
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.Hword.current-homeRow .Hletter:not(.correct-homeRow)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect-homeRow');
            });
        }
        removeClass(currentWord, 'current-homeRow');
        addClass(currentWord.nextSibling, 'current-homeRow');
        if (currentLetter) {
            removeClass(currentLetter, 'current-homeRow');
        }
        addClass(currentWord.nextSibling.firstChild, 'current-homeRow');
        const invalidWord = [...currentWord.childNodes];
        for (let i = 0; i < invalidWord.length; i++) {
            if (invalidWord[i].classList.contains('incorrect-homeRow')) {
                addClass(currentWord, 'incorrect-homeRow');
                break;
            }
        }
    }

    if (isBackspace) {
        if (currentLetter && isFirstLetter && currentWord !== firstWord) {
            removeClass(currentWord, 'current-homeRow');
            addClass(currentWord.previousSibling, 'current-homeRow');
            removeClass(currentLetter, 'current-homeRow');
            removeClass(currentWord.previousSibling, 'incorrect-homeRow');
        }
        if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current-homeRow');
            addClass(currentLetter.previousSibling, 'current-homeRow');
            removeClass(currentLetter.previousSibling, 'incorrect-homeRow');
            removeClass(currentLetter.previousSibling, 'correct-homeRow');
        }
        if (!currentLetter) {
            addClass(currentWord.lastChild, 'current-homeRow');
            removeClass(currentWord.lastChild, 'incorrect-homeRow');
            removeClass(currentWord.lastChild, 'correct-homeRow');
        }
        if (isExtra) {
            currentWord.lastChild.remove();
        }
    }

    // move lines
    if (currentWord.getBoundingClientRect().top > 560) {
        const hChar = document.getElementById('hChar');
        const margin = parseInt(hChar.style.marginTop || '0px');
        hChar.style.marginTop = (margin - 35) + 'px';
    }

    // move cursor
    const nextLetter = document.querySelector('.Hletter.current-homeRow');
    const nextWord = document.querySelector('.Hword.current-homeRow');
    const cursor_homeRow = document.getElementById('homeRow-cursor');
    cursor_homeRow.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px';
    cursor_homeRow.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
}

document.querySelector('#homeRow-game').addEventListener('click', () => { which = 2; });


//BOTROWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

const bKey = 'zxcvbnm,.'
const bChar = bKey.split('');
const bCount = bChar.length;
let bTime = 30 * 1000;
let bTimer = null;
let bGameStart = null;

function formatBWord(word) {
    return `<div class = "Bword"><span class = "Bletter">${word.split('').join('</span><span class = "Bletter">')}</span></div>`;
}
function randomBotRowWord() {
    const maxWordLength = 5;
    const wordLength = Math.ceil(Math.random() * maxWordLength);
    let randomWord = '';

    for (let i = 0; i < wordLength; i++) {
        const randomIndex = Math.floor(Math.random() * bCount);
        randomWord += bChar[randomIndex];
    }

    return randomWord;
}


function newGameBotRow() {
    document.getElementById('bChar').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('bChar').innerHTML += formatBWord(randomBotRowWord());
    }
    addClass(document.querySelector('.Bword'), 'current-botRow');
    addClass(document.querySelector('.Bletter'), 'current-botRow');
    bTimer = null;
    removeClass(document.getElementById('botRow-game'), 'over');
    document.getElementById('bChar').style.marginTop = 0;
}

function getWpmBotRow() {
    const bChar = [...document.querySelectorAll('.Bword')];
    const lastTypedWord = document.querySelector('.Bword.current-botRow');
    const lastTypedWordIndex = bChar.indexOf(lastTypedWord);
    const typedWords = bChar.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(wordB => {
        const letters = [...wordB.children];
        const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect-botRow'));
        const correctLetters = letters.filter(letter => letter.classList.contains('correct-botRow'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / bTime * 60000;
}

function gameOverBotRow() {
    clearInterval(bTimer);
    addClass(document.getElementById('botRow-game'), 'over');
    const result = getWpmBotRow();
    bGameStart = null;
    document.getElementById('botRow-game').removeEventListener('click');

}


document.getElementById('botRow-try-again').addEventListener('click', () => {
    gameOverBotRow();
    newGameBotRow();
    resetCursorB();
});

function resetCursorB() {
    const cursor_toprow = document.getElementById('botRow-cursor');
    cursor_toprow.style.top = document.querySelector('.Bletter.current-botRow').getBoundingClientRect().top + 4 + 'px';
    cursor_toprow.style.left = document.querySelector('.Bletter.current-botRow').getBoundingClientRect().left + 'px';
}

newGameBotRow();
resetCursorB();
function InitBotRowGame(ev) {
    const key = ev.key;
    const currentWord = document.querySelector('.Bword.current-botRow');
    const currentLetter = document.querySelector('.Bletter.current-botRow');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    const firstWord = document.querySelector('#bChar').firstChild;
    const isExtra = currentWord.lastChild.classList.contains('extra');

    if (document.querySelector('#botRow-game.over')) {
        return;
    }

    console.log(key, expected);



    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct-botRow' : 'incorrect-botRow');
            removeClass(currentLetter, 'current-botRow');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current-botRow');
            }
        } else {
            if (currentWord.childElementCount < 20) {
                const incorrectLetter = document.createElement('span');
                incorrectLetter.innerHTML = key;
                incorrectLetter.className = 'Bletter incorrect-botRow extra';
                currentWord.appendChild(incorrectLetter);
            }
        }
    }

    if (isSpace) {
        ev.preventDefault();
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.Bword.current-botRow .Bletter:not(.correct-botRow)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect-botRow');
            });
        }
        removeClass(currentWord, 'current-botRow');
        addClass(currentWord.nextSibling, 'current-botRow');
        if (currentLetter) {
            removeClass(currentLetter, 'current-botRow');
        }
        addClass(currentWord.nextSibling.firstChild, 'current-botRow');
        const invalidWord = [...currentWord.childNodes];
        for (let i = 0; i < invalidWord.length; i++) {
            if (invalidWord[i].classList.contains('incorrect-botRow')) {
                addClass(currentWord, 'incorrect-botRow');
                break;
            }
        }
    }

    if (isBackspace) {
        if (currentLetter && isFirstLetter && currentWord !== firstWord) {
            removeClass(currentWord, 'current-botRow');
            addClass(currentWord.previousSibling, 'current-botRow');
            removeClass(currentLetter, 'current-botRow');
            removeClass(currentWord.previousSibling, 'incorrect-botRow');
        }
        if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current-botRow');
            addClass(currentLetter.previousSibling, 'current-botRow');
            removeClass(currentLetter.previousSibling, 'incorrect-botRow');
            removeClass(currentLetter.previousSibling, 'correct-botRow');
        }
        if (!currentLetter) {
            addClass(currentWord.lastChild, 'current-botRow');
            removeClass(currentWord.lastChild, 'incorrect-botRow');
            removeClass(currentWord.lastChild, 'correct-botRow');
        }
        if (isExtra) {
            currentWord.lastChild.remove();
        }
    }

    // move lines
    if (currentWord.getBoundingClientRect().top > 560) {
        const bChar = document.getElementById('bChar');
        const margin = parseInt(bChar.style.marginTop || '0px');
        bChar.style.marginTop = (margin - 35) + 'px';
    }

    // move cursor
    const nextLetter = document.querySelector('.Bletter.current-botRow');
    const nextWord = document.querySelector('.Bword.current-botRow');
    const cursor_toprow = document.getElementById('botRow-cursor');
    cursor_toprow.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px';
    cursor_toprow.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';

}

document.querySelector('#botRow-game').addEventListener('click', () => { which = 3; });

}
export { gameStart }