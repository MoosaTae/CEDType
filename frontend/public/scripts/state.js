import { words } from './items.js'
import { name } from './option.js'
import { handleCreateItem } from './leaderboard.js'

const typingText = document.querySelector('.typing-text')
const nontypingText = document.querySelector('.non-typing-text')
const inpField = document.querySelector('#input-container')
const timeTag = document.querySelector('#time')
//const mistakeTag = document.querySelector(".mistake span")
const wpmTag = document.querySelector('#wpm')
const scoreTag = document.querySelector('#score')
const timeFrequency = 10 // millisecond

const str =
    'in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present another by few come that down last or use say take would each even govern play around back under some line think she even when from do real problem between long as there school do as mean to all on other good may from might call world thing life turn of he look last problem after get show want need thing old other during be again develop come from consider the now number say life interest to system only group world same state school one problem between for turn run at very against eye must go both still all a as so after play eye little be those should out after which these both much house become both school this he real and may mean time by real number other as feel at end ask plan come turn by all head increase he present increase use stand after see order lead than system here ask in of look point little too without each for both but right we come world much own set we right off long those stand go both but under now must real general then before with much those at no of we only back these person plan from run new as own take early just increase only look open follow get that on system the mean plan man over it possible if most late line would first without real hand say turn point small set at in system however to be home show new again come under because about show face child know person large program how over could thing from out world while nation stand part run have look what many system order some one program you great could write day do he any also where child late face eye run still again on by as call high the must by late little mean never another seem to leave because for day against public long number word about after much need open change also'
const wordie = str.split(' ')
const wordsCount = wordie.length
window.timer = null
window.gameStart = null

let timer
let wpm
let maxTime = 60
let timeLeft = maxTime
let charIndex = 0
let mistakes = 0
let isTyping = 0
let misplay = 0
let score = 0
let multiplier = 1
let timepass = 0
let max_length = 10
let min_length = 5
let game_mode = 'endless-mode'

// function generateRandomParagraph() {
//   const paragraphLength = Math.floor(Math.random() * (max_length - min_length + 1)) + min_length;
//   const paragraph = [];

//   for (let i = 0; i < paragraphLength; i++) {
//     const randomWordIndex = Math.ceil(Math.random() * words.length);
//     paragraph.push(words[randomWordIndex]);
//   }
//   return paragraph.join(' ');
// }
function addClass(el, name) {
    el.classList.add(name)
}

function removeClass(el, name) {
    el.classList.remove(name)
}
function randomWord() {
    if (game_mode == 'endless-mode') {
        const randomIndex = Math.ceil(Math.random() * words.length)
        return randomIndex - 1
    } else {
        const randomIndex = Math.ceil(Math.random() * wordsCount)
        return randomIndex - 1
    }
}
function formatWord(wordie) {
    return `<div class = "word"><span class = "letter">${wordie
        .split('')
        .join('</span><span class = "letter">')}</span></div>`
}

function getWpm() {
    const words = [...document.querySelectorAll('.word')]
    const lastTypedWord = document.querySelector('.word.current')
    const lastTypedWordIndex = words.indexOf(lastTypedWord)
    const typedWords = words.slice(0, lastTypedWordIndex)
    const correctWords = typedWords.filter((word) => {
        const letters = [...word.children]
        const incorrectLetters = letters.filter((letter) => letter.classList.contains('incorrect'))
        const correctLetters = letters.filter((letter) => letter.classList.contains('correct'))
        return incorrectLetters.length === 0 && correctLetters.length === letters.length
    })
    scoreTag.innerText = correctWords.length + 1
    wpmTag.innerText = Math.round(((correctWords.length + 1) * 60) / timepass)
}

function addParagraph() {
    if (game_mode == 'endless-mode') {
        document.querySelector('#endlessgame').style.visibility = 'visible'
        document.querySelector('#timegame').style.visibility = 'hidden'
        document.querySelector('#game').style.height = '0px'
        document.querySelector('#endlessgame').style.height = '50px'

        if (nontypingText.innerHTML == '') {
            nontypingText.innerText = words[randomWord()]
        }
        nontypingText.innerText.split('').forEach((char) => {
            let span = document.createElement('span')
            span.textContent = char
            typingText.appendChild(span)
        })
        nontypingText.innerHTML = ''
        nontypingText.innerText = words[randomWord()]
    } else if (game_mode == 'time-mode') {
        document.querySelector('#endlessgame').style.visibility = 'hidden'
        document.querySelector('#timegame').style.visibility = 'visible'
        document.querySelector('#game').style.height = '160px'
        document.querySelector('#endlessgame').style.height = '0px'
        document.getElementById('words').innerHTML = ''
        for (let i = 0; i < 200; i++) {
            document.getElementById('words').innerHTML += formatWord(wordie[randomWord()])
        }
        addClass(document.querySelector('.word'), 'current')
        addClass(document.querySelector('.letter'), 'current')
        window.timer = null
        document.getElementById('words').style.marginTop = 0
        resetCursor()
    }
    // typingText.querySelector("span").classList.add("active");
}
function resetWord() {
    typingText.innerHTML = ''
    inpField.value = ''
    charIndex = 0
    addParagraph()
}

// randomly load a paragraph from the words
function loadParagraph() {
    resetWord()
    document.addEventListener('keydown', () => inpField.focus())
    typingText.addEventListener('click', () => inpField.focus())
}

function resetGame() {
    loadParagraph()
    clearInterval(timer)
    if (game_mode == 'time-mode') resetCursor()
    timeLeft = maxTime
    charIndex = mistakes = isTyping = 0
    inpField.value = ''
    timeTag.innerText = timeLeft
    wpmTag.innerText = 0
    scoreTag.innerText = 0
    score = 0
    multiplier = 1
    timepass = 0
}

function initTyping() {
    let characters = typingText.querySelectorAll('span')
    let typedChar = inpField.value.split('')[charIndex]
    if (timeLeft > 0) {
        // start timer
        if (!isTyping) {
            timer = setInterval(initTimer, timeFrequency)
            isTyping = true
        }
        // delete case
        if (typedChar == null) {
            // is it start of the paragraph?
            if (charIndex > 0) {
                charIndex--
                if (characters[charIndex].classList.contains('incorrect')) {
                    misplay = 0
                }
                characters[charIndex].classList.remove('correct', 'incorrect')
            }
        }
        // normal case
        else {
            if (characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add('correct')
            } else {
                misplay = 1
                characters[charIndex].classList.add('incorrect')
            }
            charIndex++
            if (charIndex == characters.length) {
                CheckWord()
            }
        }
    } else {
        clearInterval(timer)
        window.gameStart = null
        inpField.value = ''
    }
}

function CheckWord() {
    if (misplay == 0) {
        score++
        scoreTag.innerText = score
        timeLeft += 2.5
    } else {
        timeLeft -= 5
    }
    resetWord()
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft -= 0.01 * multiplier
        timepass += 0.01
        if ((game_mode = 'endless-mode')) multiplier = Math.ceil(timepass / 30)
        if (timeLeft < 0) timeLeft = 0
        timeTag.innerText = timeLeft
        if (game_mode == 'endless-mode') {
            let wpm = Math.round((score * 60) / timepass)
            wpmTag.innerText = wpm
        }
    } else {
        clearInterval(timer)
        getWpm()
    }
}

function setMaxTime(newTime) {
    maxTime = newTime
    resetGame()
}

function changeMode(mode) {
    game_mode = mode
    resetGame()
}

//copypasta
document.getElementById('game').addEventListener('keydown', (ev) => {
    const key = ev.key
    const currentWord = document.querySelector('.word.current')
    const currentLetter = document.querySelector('.letter.current')
    const expected = currentLetter?.innerHTML || ' '
    const isLetter = key.length === 1 && key !== ' '
    const isSpace = key === ' '
    const isBackspace = key === 'Backspace'
    const isFirstLetter = currentLetter === currentWord.firstChild
    const firstWord = document.querySelector('#words').firstChild
    const isExtra = currentWord.lastChild.classList.contains('extra')

    // if (document.querySelector('#game.over')) {
    //   return;
    // }

    console.log(key, expected)

    // if (!window.timer && (isLetter || isSpace)) {
    //   window.timer = setInterval(() => {
    //     if (!window.gameStart) {
    //       window.gameStart = (new Date()).getTime();
    //     }
    //     const currentTime = (new Date()).getTime();
    //     const msPassed = currentTime - window.gameStart;
    //     const sPassed = Math.round(msPassed / 1000);
    //     const sLeft = (gameTime / 1000) - sPassed;
    //     if (sLeft <= 0) {
    //       gameOver();
    //       return;
    //     }
    //     document.getElementById('info').innerHTML = sLeft;
    //   }, 1000);
    // }
    if (timeLeft > 0) {
        //time running
        if (!isTyping) {
            timer = setInterval(initTimer, timeFrequency)
            isTyping = true
        }
        if (isLetter) {
            if (currentLetter) {
                addClass(currentLetter, key === expected ? 'correct' : 'incorrect')
                removeClass(currentLetter, 'current')
                if (currentLetter.nextSibling) {
                    addClass(currentLetter.nextSibling, 'current')
                }
            } else {
                if (currentWord.childElementCount < 20) {
                    const incorrectLetter = document.createElement('span')
                    incorrectLetter.innerHTML = key
                    incorrectLetter.className = 'letter incorrect extra'
                    currentWord.appendChild(incorrectLetter)
                }
            }
        }

        if (isSpace) {
            getWpm()
            if (expected !== ' ') {
                const lettersToInvalidate = [
                    ...document.querySelectorAll('.word.current .letter:not(.correct)'),
                ]
                lettersToInvalidate.forEach((letter) => {
                    addClass(letter, 'incorrect')
                })
            }
            removeClass(currentWord, 'current')
            addClass(currentWord.nextSibling, 'current')
            if (currentLetter) {
                removeClass(currentLetter, 'current')
            }
            addClass(currentWord.nextSibling.firstChild, 'current')
            const invalidWord = [...currentWord.childNodes]
            for (let i = 0; i < invalidWord.length; i++) {
                if (invalidWord[i].classList.contains('incorrect')) {
                    addClass(currentWord, 'incorrect')
                    break
                }
            }
        }

        if (isBackspace) {
            if (currentLetter && isFirstLetter && currentWord !== firstWord) {
                removeClass(currentWord, 'current')
                addClass(currentWord.previousSibling, 'current')
                removeClass(currentLetter, 'current')
                removeClass(currentWord.previousSibling, 'incorrect')
            }
            if (currentLetter && !isFirstLetter) {
                removeClass(currentLetter, 'current')
                addClass(currentLetter.previousSibling, 'current')
                removeClass(currentLetter.previousSibling, 'incorrect')
                removeClass(currentLetter.previousSibling, 'correct')
            }
            if (!currentLetter) {
                addClass(currentWord.lastChild, 'current')
                removeClass(currentWord.lastChild, 'incorrect')
                removeClass(currentWord.lastChild, 'correct')
            }
            if (isExtra) {
                currentWord.lastChild.remove()
            }
        }

        // move lines
        if (currentWord.getBoundingClientRect().top > 560) {
            const words = document.getElementById('words')
            const margin = parseInt(words.style.marginTop || '0px')
            words.style.marginTop = margin - 35 + 'px'
        }

        // move cursor
        const nextLetter = document.querySelector('.letter.current')
        const nextWord = document.querySelector('.word.current')
        const cursor = document.getElementById('cursor')
        cursor.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px'
        cursor.style.left =
            (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px'
    } else {
        clearInterval(timer)
        window.gameStart = null
        inpField.value = ''
    }
})
//px = ชิบหาย
function resetCursor() {
    if (game_mode == 'time-mode') {
        const cursor = document.getElementById('cursor')
        cursor.style.top =
            document.querySelector('.letter.current').getBoundingClientRect().top + 4 + 'px'
        cursor.style.left =
            document.querySelector('.letter.current').getBoundingClientRect().left + 'px'
    }
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
}
