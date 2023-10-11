function addClass(el, name) {
    el.classList.add(name);
} //reuseable

function removeClass(el, name) {
    el.classList.remove(name);
} //reuseable

function formatWordB(word) {
    return `<div class = "wordB"><span class = "letterB">${word.split('').join('</span><span class = "letterB">')}</span></div>`;
} 




const bKey =  'zxcvbnm,.'
const bChar = bKey.split('');
const bCount = bChar.length;
let bTime = 30 * 1000;
let bTimer = null;
let bGameStart = null;


function randomBotRowWord() {
    const maxWordLength = 3; 
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
    document.getElementById('bInfo').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('bChar').innerHTML += formatWordB(randomBotRowWord());
    }
    addClass(document.querySelector('.wordB'), 'current-botRow');
    addClass(document.querySelector('.letter'), 'current-botRow');
    document.getElementById('bInfo').innerHTML = (bTime / 1000);
    bTimer = null;
    removeClass(document.getElementById('botRow-game'), 'over');
    document.getElementById('bChar').style.marginTop = 0;
}

function getWpmTopRow() {
    const bChar = [...document.querySelectorAll('.wordB')];
    const lastTypedWord = document.querySelector('.wordB.current-botRow');
    const lastTypedWordIndex = bChar.indexOf(lastTypedWord);
    const typedWords = bChar.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
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
    const result = getWpmTopRow();
    document.getElementById('bInfo').innerHTML = `WPM: ${result}`;
    bGameStart = null;
    

}


document.getElementById('botRow-try-again').addEventListener('click', () => {
    gameOverBotRow();
    newGameBotRow();
    resetCursorB();
});

function resetCursorB() {
    const cursor_toprow = document.getElementById('botRow-cursor');
    cursor_toprow.style.top = document.querySelector('.letter.current-botRow').getBoundingClientRect().top + 4 + 'px';
    cursor_toprow.style.left = document.querySelector('.letter.current-botRow').getBoundingClientRect().left + 'px';
}

newGameBotRow();
resetCursorB();

document.querySelector('#botRow-game').addEventListener('click',()=>{
    document.getElementById('botRow-game').addEventListener('keydown', ev => {
        const key = ev.key;
        const currentWord = document.querySelector('.wordB.current-botRow');
        const currentLetter = document.querySelector('.letter.current-botRow');
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
    
        if (!bTimer && (isLetter || isSpace)) {
            bTimer = setInterval(() => {
                if (!bGameStart) {
                    bGameStart = (new Date()).getTime();
                }
                const currentTime = (new Date()).getTime();
                const msPassed = currentTime - bGameStart;
                const sPassed = Math.round(msPassed / 1000);
                const sLeft = (bTime / 1000) - sPassed;
                if (sLeft <= 0) {
                    gameOverBotRow();
                    return;
                }
                document.getElementById('bInfo').innerHTML = sLeft;
            }, 1000);
        }
    
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
                    incorrectLetter.className = 'letterB incorrect-botRow extra';
                    currentWord.appendChild(incorrectLetter);
                }
            }
        }
    
        if (isSpace) {
            if (expected !== ' ') {
                const lettersToInvalidate = [...document.querySelectorAll('.wordB.current-botRow .letter:not(.correct-botRow)')];
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
        const nextLetter = document.querySelector('.letter.current-botRow');
        const nextWord = document.querySelector('.wordB.current-botRow');
        const cursor_toprow = document.getElementById('botRow-cursor');
        cursor_toprow.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px';
        cursor_toprow.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
    });
});