// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { remote } = require('electron')

const self = remote.getCurrentWindow()

let progress = 0.01

let progressInterval = setInterval(() => {

  self.setProgressBar(progress)

  if (progress <= 1) {
    progress += 0.01
  } else {
    self.setProgressBar(-1)
    clearInterval(progressInterval)
  }
}, 75)
