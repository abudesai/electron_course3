'use strict';

// Modules
const {app, BrowserWindow, ipcMain} = require('electron');
const windowStateKeeper = require('electron-window-state');
const readItem = require('./readItem');

// for auto-reload 
require('electron-reload')(__dirname);


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  // win state keeper
  let mainWindowState = windowStateKeeper({
    defaultWidth: 500, 
    defaultHeight: 650
  }); 

  // console.log("app is now ready");
  mainWindow = new BrowserWindow({
    'x': mainWindowState.x, 
    'y': mainWindowState.y,
    'width': mainWindowState.width, 
    'height': mainWindowState.height,
    minWidth: 350, 
    maxWidth: 650, 
    minHeight: 300, 
    webPreferences: { nodeIntegration: true }
  }); 


  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/main.html');

  mainWindowState.manage(mainWindow);

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    debugger;
    mainWindow = null;
  })
}

// Electron `app` is ready
app.on('ready', createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow();
})

ipcMain.on("new-item", (e, itemUrl) => {
  console.log('received new item: ', itemUrl);

  readItem( itemUrl, item => {
    e.sender.send('new-item-success', item);
  });

})
