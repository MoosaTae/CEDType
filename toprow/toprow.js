
const tKey =  'qwertyuiop'
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

function formatWord(word) {
    return `<div class = "word"><span class = "letter">${word.split('').join('</span><span class = "letter">')}</span></div>`;
} //reuseable

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
    document.getElementById('tInfo').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('tChar').innerHTML += formatWord(randomTopRowWord());
    }
    addClass(document.querySelector('.word'), 'current-topRow');
    addClass(document.querySelector('.letter'), 'current-topRow');
    document.getElementById('tInfo').innerHTML = (tTime / 1000);
    tTimer = null;
    removeClass(document.getElementById('topRow-game'), 'over');
    document.getElementById('tChar').style.marginTop = 0;
}

function getWpmTopRow() {
    const tChar = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current-topRow');
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
    document.getElementById('tInfo').innerHTML = `WPM: ${result}`;
    tGameStart = null;
}


document.getElementById('topRow-try-again').addEventListener('click', () => {
    gameOverTopRow();
    newGameTopRow();
    resetCursorT();
});

function resetCursorT() {
    const cursor_toprow = document.getElementById('topRow-cursor');
    cursor_toprow.style.top = document.querySelector('.letter.current-topRow').getBoundingClientRect().top + 4 + 'px';
    cursor_toprow.style.left = document.querySelector('.letter.current-topRow').getBoundingClientRect().left + 'px';
}

newGameTopRow();
resetCursorT();

document.querySelector('#topRow-game').addEventListener('click',()=>{
    document.getElementById('topRow-game').addEventListener('keydown', ev => {
        const key = ev.key;
        const currentWord = document.querySelector('.word.current-topRow');
        const currentLetter = document.querySelector('.letter.current-topRow');
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
    
        if (!tTimer && (isLetter || isSpace)) {
            tTimer = setInterval(() => {
                if (!tGameStart) {
                    tGameStart = (new Date()).getTime();
                }
                const currentTime = (new Date()).getTime();
                const msPassed = currentTime - tGameStart;
                const sPassed = Math.round(msPassed / 1000);
                const sLeft = (tTime / 1000) - sPassed;
                if (sLeft <= 0) {
                    gameOverTopRow();
                    return;
                }
                document.getElementById('tInfo').innerHTML = sLeft;
            }, 1000);
        }
    
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
                    incorrectLetter.className = 'letter incorrect-topRow extra';
                    currentWord.appendChild(incorrectLetter);
                }
            }
        }
    
        if (isSpace) {
            if (expected !== ' ') {
                const lettersToInvalidate = [...document.querySelectorAll('.word.current-topRow .letter:not(.correct-topRow)')];
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
        const nextLetter = document.querySelector('.letter.current-topRow');
        const nextWord = document.querySelector('.word.current-topRow');
        const cursor_toprow = document.getElementById('topRow-cursor');
        cursor_toprow.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px';
        cursor_toprow.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
    });
});