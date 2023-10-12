import { setMaxTime, changeMode } from './state.js'
import { sleep } from './utils.js'
let name = ''
function swapButtonActive(textButtons, button) {
    textButtons.forEach((btn) => {
        btn.classList.remove('textButton-active')
    })
    button.classList.add('textButton-active')
}

function initializeTimeButton() {
    const textButtons = document.querySelectorAll('.time-option .textButton')
    textButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const timeValue = button.querySelector('span').textContent
            setMaxTime(timeValue)
            swapButtonActive(textButtons, button)
        })
    })
}

function initializeModeButton() {
    const textButtons = document.querySelectorAll('.mode-option .textButton')
    textButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const mode = button.querySelector('span').parentElement.id
            switch (mode) {
                case 'time-mode':
                    changeMode('time-mode')
                    break
                case 'endless-mode':
                    changeMode('endless-mode')
                    break
                case 'secret-mode':
                    break
                default:
                    break
            }
            swapButtonActive(textButtons, button)
        })
    })
}
function initializeNameInputButton() {
    const NameSS = document.querySelector('.NameS')
    document.querySelector('#loginB').addEventListener('click', () => {
        NameSS.classList.toggle('show')

        document.addEventListener('keydown', () => document.querySelector('#name-input').focus())
    })
    document.querySelector('#namesummitbutton').addEventListener('click', () => {
        document.querySelector('#loginS').innerHTML = document.querySelector('#name-input').value
        name = document.querySelector('#name-input').value
        NameSS.classList.toggle('show')
        document.querySelector('#loginB').style.visibility = 'hidden'
        // remove loginB
    })
}

function initializeTutorialButton() {
    const tutorial = document.querySelector('.Tutorial')
    function toggleEdu() {
        tutorial.classList.toggle('show')
    }

    document.querySelector('.education').addEventListener('click', toggleEdu)
    document.querySelector('.close-tutorial').addEventListener('click', toggleEdu)
}

function initializeLeaderboardButton() {
    const leaderboard = document.querySelector('.leaderboard')
    document.querySelector('.hallofframe').addEventListener('click', () => {
        leaderboard.classList.toggle('show')
    })
    document.querySelector('#LBRimg').addEventListener('click', () => {
        leaderboard.classList.toggle('show')
    })
}
function initializeButton() {
    initializeTimeButton()
    initializeModeButton()
    initializeNameInputButton()
    initializeTutorialButton()
    initializeLeaderboardButton()
}

export { initializeButton, name }
