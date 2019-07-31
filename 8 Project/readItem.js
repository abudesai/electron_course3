
const { BrowserWindow } = require("electron");

// offscreen browserwindow
let offscreenWindow;



// exported readItem function
module.exports = (url, callback) => {
    

    // create Offscreen Window
    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true,
            nodeIntegration: false
        }
    })

    // load item url
    offscreenWindow.loadURL(url);
    

    // wait for content to finish loading
    offscreenWindow.webContents.on('did-finish-load', e=>{
        
        // get page title
        let title = offscreenWindow.getTitle();

        // Get screenshot thumbnail
        offscreenWindow.webContents.capturePage( image => {

            // get image as dataURL
            let screenshot = image.toDataURL();

            // console.log("screenshot", screenshot);

            // Execute callback with new item object
            callback({ title, screenshot, url });

            // clean up
            offscreenWindow.close();
            offscreenWindow = null;
        });        
    });

} 