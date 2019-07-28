// Modules
const {app, BrowserWindow} = require('electron')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.disableHardwareAcceleration()

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      offscreen: true
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadURL('https://electronjs.org')

  let i = 1
  mainWindow.webContents.on('paint', (e, dirty, image) => {

    let screenshot = image.toPNG()
    fs.writeFile( app.getPath('desktop') + `/screenshot_${i}.png`, screenshot, console.log )
    i++
  })

  mainWindow.webContents.on('did-finish-load', e => {
    console.log( mainWindow.getTitle() )

    mainWindow.close()
    mainWindow = null
  })

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  // mainWindow.on('closed',  () => {
  //   mainWindow = null
  // })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
