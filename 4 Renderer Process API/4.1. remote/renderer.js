// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote
const { app, dialog, BrowserWindow } = remote

const button = document.getElementById('test-button')

button.addEventListener('click', e => {

  // dialog.showMessageBox({ message: 'Dialog invoked from Renderer process' })

  // let secWin = new BrowserWindow({
  //   width: 400, height: 350
  // })
  // secWin.loadFile('index.html')

  // console.log( remote.getGlobal('myglob') )

  // app.quit()

  let win = remote.getCurrentWindow()
  win.maximize()

})
