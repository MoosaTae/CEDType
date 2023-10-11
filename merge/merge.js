
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
        const randomIndex = Math.floor(Math.random() * tCount);
        randomWord += hChar[randomIndex];
    }

    return randomWord;
}


function newGamehomeRow() {
    document.getElementById('hChar').innerHTML = '';
    document.getElementById('tInfo').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('hChar').innerHTML += formatWord(randomhomeRowWord());
    }
    addClass(document.querySelector('.word'), 'current-homeRow');
    addClass(document.querySelector('.letter'), 'current-homeRow');
    document.getElementById('tInfo').innerHTML = (hTime / 1000);
    hTimer = null;
    removeClass(document.getElementById('homeRow-game'), 'over');
    document.getElementById('hChar').style.marginTop = 0;
}

function getWpmhomeRow() {
    const hChar = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current-homeRow');
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
    document.getElementById('tInfo').innerHTML = `WPM: ${result}`;
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
        const currentWord = document.querySelector('.word.current-homeRow');
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
                const lettersToInvalidate = [...document.querySelectorAll('.word.current-homeRow .letter:not(.correct-homeRow)')];
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
        const nextWord = document.querySelector('.word.current-homeRow');
        const cursor_homeRow = document.getElementById('homeRow-cursor');
        cursor_homeRow.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px';
        cursor_homeRow.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
    });
});




const bKey =  'zxcvbnm,.'
const bChar = bKey.split('');
const bCount = bChar.length;
let bTime = 30 * 1000;
let bTimer = null;
let bGameStart = null;


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
function formatWordB(word) {
    return `<div class = "wordB"><span class = "letterB">${word.split('').join('</span><span class = "letterB">')}</span></div>`;
} 



function newGameBotRow() {
    document.getElementById('bChar').innerHTML = '';
    document.getElementById('bInfo').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('bChar').innerHTML += formatWord(randomBotRowWord());
    }
    addClass(document.querySelector('.wordB'), 'current-botRow');
    addClass(document.querySelector('.letterB'), 'current-botRow');
    document.getElementById('bInfo').innerHTML = (bTime / 1000);
    bTimer = null;
    removeClass(document.getElementById('botRow-game'), 'over');
    document.getElementById('bChar').style.marginTop = 0;
}

function getWpmBotRow() {
    const bChar = [...document.querySelectorAll('.wordB')];
    const lastTypedWord = document.querySelector('.wordB.current-botRow');
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
    document.getElementById('bInfo').innerHTML = `WPM: ${result}`;
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
    cursor_toprow.style.top = document.querySelector('.letterB.current-botRow').getBoundingClientRect().top + 4 + 'px';
    cursor_toprow.style.left = document.querySelector('.letterB.current-botRow').getBoundingClientRect().left + 'px';
}

newGameBotRow();
resetCursorB();


document.querySelector('#botRow-game').addEventListener('click',()=>{    document.getElementById('botRow-game').addEventListener('keydown', ev => {
        const key = ev.key;
        const currentWord = document.querySelector('.wordB.current-botRow');
        const currentLetter = document.querySelector('.letterB.current-botRow');
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
                    incorrectLetter.className = 'letterB incorrect-botRow extra';
                    currentWord.appendChild(incorrectLetter);
                }
            }
        }
    
        if (isSpace) {
            if (expected !== ' ') {
                const lettersToInvalidate = [...document.querySelectorAll('.wordB.current-botRow .letterB:not(.correct-botRow)')];
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
        const nextLetter = document.querySelector('.letterB.current-botRow');
        const nextWord = document.querySelector('.wordB.current-botRow');
        const cursor_toprow = document.getElementById('botRow-cursor');
        cursor_toprow.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px';
        cursor_toprow.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
    });
});