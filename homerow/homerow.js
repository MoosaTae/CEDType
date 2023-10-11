function addClass(el, name) {
    el.classList.add(name);
} //reuseable

function removeClass(el, name) {
    el.classList.remove(name);
} //reuseable


const hKey =  'asdfghjkl;'
const hChar = hKey.split('');
const hCount = hChar.length;
let hTime = 30 * 1000;
let hTimer = null;
let hGameStart = null;

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
function formatWordH(wordH) {
    return `<div class = "wordH"><span class = "letterB">${wordH.split('').join('</span><span class = "letterB">')}</span></div>`;
} 


function newGamehomeRow() {
    document.getElementById('hChar').innerHTML = '';
    document.getElementById('hInfo').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('hChar').innerHTML += formatWordH(randomhomeRowWord());
    }
    addClass(document.querySelector('.wordH'), 'current-homeRow');
    addClass(document.querySelector('.letter'), 'current-homeRow');
    document.getElementById('hInfo').innerHTML = (hTime / 1000);
    hTimer = null;
    removeClass(document.getElementById('homeRow-game'), 'over');
    document.getElementById('hChar').style.marginTop = 0;
}

function getWpmhomeRow() {
    const hChar = [...document.querySelectorAll('.wordH')];
    const lastTypedWord = document.querySelector('.wordH.current-homeRow');
    const lastTypedWordIndex = hChar.indexOf(lastTypedWord);
    const typedWords = hChar.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(wordH => {
        const letters = [...wordH.children];
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
    document.getElementById('hInfo').innerHTML = `WPM: ${result}`;
    hGameStart = null;
}


document.getElementById('homeRow-try-again').addEventListener('click', () => {
    gameOverhomeRow();
    newGamehomeRow();
    resetCursorH();
});

function resetCursorH() {
    const cursor_homeRow = document.getElementById('homeRow-cursor');
    cursor_homeRow.style.top = document.querySelector('.letter.current-homeRow').getBoundingClientRect().top + 4 + 'px';
    cursor_homeRow.style.left = document.querySelector('.letter.current-homeRow').getBoundingClientRect().left + 'px';
}

newGamehomeRow();
resetCursorH();

document.querySelector('#homeRow-game').addEventListener('click',()=>{
    document.getElementById('homeRow-game').addEventListener('keydown', ev => {
        const key = ev.key;
        const currentWord = document.querySelector('.wordH.current-homeRow');
        const currentLetter = document.querySelector('.letter.current-homeRow');
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
    
        if (!hTimer && (isLetter || isSpace)) {
            hTimer = setInterval(() => {
                if (!hGameStart) {
                    hGameStart = (new Date()).gehTime();
                }
                const currenhTime = (new Date()).gehTime();
                const msPassed = currenhTime - hGameStart;
                const sPassed = Math.round(msPassed / 1000);
                const sLeft = (hTime / 1000) - sPassed;
                if (sLeft <= 0) {
                    gameOverhomeRow();
                    return;
                }
                document.getElementById('hInfo').innerHTML = sLeft;
            }, 1000);
        }
    
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
                    incorrectLetter.className = 'letter incorrect-homeRow extra';
                    currentWord.appendChild(incorrectLetter);
                }
            }
        }
    
        if (isSpace) {
            if (expected !== ' ') {
                const lettersToInvalidate = [...document.querySelectorAll('.wordH.current-homeRow .letter:not(.correct-homeRow)')];
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
        const nextLetter = document.querySelector('.letter.current-homeRow');
        const nextWord = document.querySelector('.wordH.current-homeRow');
        const cursor_homeRow = document.getElementById('homeRow-cursor');
        cursor_homeRow.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px';
        cursor_homeRow.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
    });
});