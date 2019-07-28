
const { remote } = require('electron')
const fs = require('fs')

const desktopPath = remote.app.getPath('desktop')

window.writeToFile = text => {
  fs.writeFile( desktopPath + '/app.txt', text, console.log )
}


window.versions = {
  node: process.versions.node,
  electron: process.versions.electron
}
