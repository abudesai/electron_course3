// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron')

const displays = electron.screen.getAllDisplays()

console.log( `${displays[0].size.width} x ${displays[0].size.height}` )
console.log( `${displays[0].bounds.x}, ${displays[0].bounds.y}` )
console.log( `${displays[1].size.width} x ${displays[1].size.height}` )
console.log( `${displays[1].bounds.x}, ${displays[1].bounds.y}` )


electron.screen.on( 'display-metrics-changed', (e, display, metricsChanged) => {
  console.log( metricsChanged )
})

document.getElementsByTagName('body')[0].addEventListener( 'click', e => {
  console.log( electron.screen.getCursorScreenPoint() )
})
