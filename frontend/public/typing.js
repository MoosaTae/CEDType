
// let gameTime = 30 * 1000;
// window.timer = null;
// window.gameStart = null;

// function addClass(el, name) {
//     el.classList.add(name);
// }

// function removeClass(el, name) {
//     el.classList.remove(name);
// }

// function randomWord() {
//     const randomIndex = Math.ceil(Math.random() * wordsCount);
//     return words[randomIndex - 1];
// }

// function formatWord(word) {
//  return `<div class = "word"><span class = "letter">${word.split('').join('</span><span class = "letter">')}</span></div>`;
// }

// function newGame() {
//     document.getElementById('words').innerHTML = '';
//     document.getElementById('info').innerHTML = '';
//     for (let i = 0; i < 200; i++) {
//         document.getElementById('words').innerHTML += formatWord(randomWord());
//     }
//     addClass(document.querySelector('.word'), 'current');
//     addClass(document.querySelector('.letter'), 'current');
//     // document.getElementById('info').innerHTML = (gameTime / 1000);
//     window.timer = null;
//     // removeClass(document.getElementById('game'), 'over');
//     document.getElementById('words').style.marginTop = 0;
// }
//เก็บไว้ก่อน
function getWpm() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect'));
        const correctLetters = letters.filter(letter => letter.classList.contains('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / gameTime * 60000;
}

// function gameOver() {
//     clearInterval(window.timer);
//     addClass(document.getElementById('game'), 'over');
//     const result = getWpm();
//     document.getElementById('info').innerHTML = `WPM: ${result}`;
//     window.gameStart = null;
// }

document.getElementById('game').addEventListener('keydown', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    const firstWord = document.querySelector('#words').firstChild;
    const isExtra = currentWord.lastChild.classList.contains('extra');

    if (document.querySelector('#game.over')) {
        return;
    }

    console.log(key, expected);

    if (!window.timer && (isLetter || isSpace)) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = (gameTime / 1000) - sPassed;
            if (sLeft <= 0) {
                gameOver();
                return;
            }
            document.getElementById('info').innerHTML = sLeft;
        }, 1000);
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            if (currentWord.childElementCount < 20) {
                const incorrectLetter = document.createElement('span');
                incorrectLetter.innerHTML = key;
                incorrectLetter.className = 'letter incorrect extra';
                currentWord.appendChild(incorrectLetter);
            }
        }
    }

    if (isSpace) {
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
        const invalidWord = [...currentWord.childNodes];
        for (let i = 0; i < invalidWord.length; i++) {
            if (invalidWord[i].classList.contains('incorrect')) {
                addClass(currentWord, 'incorrect');
                break;
            }
        }
    }

    if (isBackspace) {
        if (currentLetter && isFirstLetter && currentWord !== firstWord) {
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            removeClass(currentWord.previousSibling, 'incorrect');
        }
        if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
        if (isExtra) {
            currentWord.lastChild.remove();
        }
    }

    // move lines
    if (currentWord.getBoundingClientRect().top > 560) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    }

    // move cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

// document.getElementById('newGameBtn').addEventListener('click', () => {
//     gameOver();
//     newGame();
//     resetCursor();
// });

function resetCursor() {
    cursor.style.top = document.querySelector('.letter.current').getBoundingClientRect().top + 4 + 'px';
    cursor.style.left = document.querySelector('.letter.current').getBoundingClientRect().left + 'px';
}

newGame();
resetCursor();