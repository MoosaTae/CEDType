import { wordie } from './items.js'
import { name } from './option.js'
// import { handleCreateItem } from './leaderboard.js'
const words = wordie
const typingText = document.querySelector('.typing-text')
const nontypingText = document.querySelector('.non-typing-text')
const inpField = document.querySelector('#input-container')
const timeTag = document.querySelector('#time')
const wpmTag = document.querySelector('#wpm')
const scoreTag = document.querySelector('#score')
const endlessCursor = document.getElementById('endless-cursor')
const timeFrequency = 10 // millisecond

window.timer = null
window.gameStart = null

let timer
let wpm
let maxTime = 30
let timeLeft = maxTime
let charIndex = 0
let mistakes = 0
let isTyping = 0
let misplay = 0
let score = 0
let multiplier = 1
let timepass = 0
let game_mode = 'time-mode'

const timegame = document.getElementById('timegame')
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

function setMaxTime(newTime) {
  maxTime = parseFloat(newTime)
  resetGame()
}

function changeMode(mode) {
  game_mode = mode
  resetGame()
}
function randomWord() {
  if (game_mode == 'endless-mode') {
    const randomIndex = Math.ceil(Math.random() * words.length)
    return randomIndex - 1
  } else {
    const randomIndex = Math.ceil(Math.random() * wordie.length)
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
  wpm = Math.round(((correctWords.length + 1) * 60) / timepass)
  wpmTag.innerText = wpm
}

function setupTextAndMode() {
  if (game_mode == 'endless-mode') {
    document.querySelector('#endlessgame').style.visibility = 'visible'
    document.querySelector('#timegame').style.visibility = 'hidden'
    document.querySelector('#timegame').style.height = '0px'
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
    console.log(game_mode)
    document.querySelector('#endlessgame').style.visibility = 'hidden'
    document.querySelector('#timegame').style.visibility = 'visible'
    document.querySelector('#timegame').style.height = '200px'
    document.querySelector('#endlessgame').style.height = '0px'
    document.getElementById('words').innerHTML = ''
    for (let i = 0; i < Math.max(180, maxTime * 4); i++) {
      document.getElementById('words').innerHTML += formatWord(wordie[randomWord()])
    }
    addClass(document.querySelector('.word'), 'current')
    addClass(document.querySelector('.letter'), 'current')
    window.timer = null
    document.getElementById('words').style.marginTop = 0
    resetCursor()
  }
}
function resetWord() {
  typingText.innerHTML = ''
  inpField.value = ''
  charIndex = 0
  setupTextAndMode()
  if (game_mode == 'endless-mode') {
    resetCursor()
  }
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
  resetCursor()
  timeLeft = maxTime
  charIndex = mistakes = isTyping = 0
  inpField.value = ''
  timeTag.innerText = maxTime.toFixed(1)
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
      endlessCursor.style.left = characters[charIndex].getBoundingClientRect().left + 'px'
      endlessCursor.style.top = characters[charIndex].getBoundingClientRect().top + 4 + 'px'
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
      } else {
        endlessCursor.style.left = characters[charIndex].getBoundingClientRect().left + 'px'
        endlessCursor.style.top = characters[charIndex].getBoundingClientRect().top + 4 + 'px'
      }
    }
  } else {
    clearInterval(timer)
    window.gameStart = null
    inpField.value = ''
    if (name != '') {
      if (game_mode == 'endless-mode') handleCreateItem(name, score, wpm, 2)
      else handleCreateItem(name, score, wpm, 1)
    }
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
    if (game_mode == 'endless-mode') multiplier = Math.ceil(timepass / 30)
    if (timeLeft < 0) timeLeft = 0
    timeTag.innerText = timeLeft.toFixed(1)
    if (game_mode == 'endless-mode') {
      wpm = Math.round((score * 60) / timepass)
      wpmTag.innerText = wpm
    }
  } else {
    clearInterval(timer)
    if (name != '') {
      if (game_mode == 'endless-mode') handleCreateItem(name, score, wpm, maxTime, 2)
      else handleCreateItem(name, score, wpm, maxTime, 1)
    }
    getWpm()
  }
  // console.log(document.activeElement)
}

timegame.addEventListener('keydown', (ev) => {
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
  const wordHeight = document.querySelector('.word').offsetHeight
  const maxHeight = wordHeight + 507.5 //approximately 3

  if (timeLeft > 0) {
    if (!isTyping && key.length === 1) {
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
    if (currentWord.getBoundingClientRect().top > maxHeight) {
      const words = document.getElementById('words')
      const margin = parseInt(words.style.marginTop || '0px')
      words.style.marginTop = margin - wordHeight + 'px'
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

function resetCursor() {
  if (game_mode == 'endless-mode') {
    endlessCursor.style.left = typingText.getBoundingClientRect().left + 'px'
    endlessCursor.style.top = typingText.getBoundingClientRect().top + 4 + 'px'
  } else if (game_mode == 'time-mode') {
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
