import { loadParagraph, initTyping, resetGame } from './state.js'
import { initializeButton } from './option.js'
import { InitLeaderboard } from './leaderboard.js'

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
  inpField.addEventListener('keydown', TabReset)
  tryAgainBtn.addEventListener('keydown', TabReset)
  timeGame.addEventListener('keydown', TabReset)

  inpField.addEventListener('input', initTyping)
  tryAgainBtn.addEventListener('click', resetGame)
}
export { gameStart }
