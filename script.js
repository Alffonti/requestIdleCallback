const box = document.querySelector('#box')
const urgentSection = document.querySelector('#urgent-section')
const cancelIdleCallbackBtn = document.querySelector('#cancel-idle-callback')
const colorForm = document.getElementById('colorForm')
const colorSelect = document.getElementById('colorSelect')

let tickCount = 100
let markedCompleted = false
let id = null
let statusRefreshScheduled = false

const tick = deadline => {
  while (deadline.timeRemaining() > 0 && tickCount > 0 && !markedCompleted) {
    tickCount = tickCount - 1
    if (tickCount > 0 && !markedCompleted) {
      scheduleStatusRefresh()
      id = requestIdleCallback(tick)
      return
    }
    upgradeBoxImportance()
  }
}

requestIdleCallback(tick)

function scheduleStatusRefresh() {
  if (!statusRefreshScheduled) {
    requestAnimationFrame(updateDisplay)
    statusRefreshScheduled = true
  }
}

const updateDisplay = () => {
  box.textContent = `${tickCount}%`
  statusRefreshScheduled = false
}

const lookBusy = () => {
  const waitTime = inRange(13, 20) // 16 ms is window smooth animation
  const start = performance.now()

  while (performance.now() - start < waitTime) {
    // busy task
  }
  requestAnimationFrame(lookBusy)
}
requestAnimationFrame(lookBusy)

const io = new IntersectionObserver(entries => {
  if (markedCompleted) {
    io.unobserve(urgentSection)
    return
  }

  for (const entry of entries) {
    if (entry.target === urgentSection && entry.isIntersecting) {
      upgradeBoxImportance()
    }
  }
})

io.observe(urgentSection)

function inRange(lower, upper) {
  return lower + Math.random() * (upper - lower)
}

function upgradeBoxImportance() {
  box.textContent = 'Task completed'
  box.style.background = 'green'
  markedCompleted = true
}

colorForm.addEventListener('submit', event => {
  event.preventDefault() // Prevent the form from actually submitting

  // Get the selected color from the dropdown
  const selectedColor = colorSelect.value

  // Set the body's background color to the selected color
  document.body.style.backgroundColor = selectedColor
})

cancelIdleCallbackBtn.addEventListener('click', event => {
  cancelIdleCallback(id)
  box.textContent = 'Task canceled'
  box.style.background = 'red'
})

updateDisplay()
