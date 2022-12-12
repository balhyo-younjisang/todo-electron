const { app, BrowserWindow, ipcMain } = require('electron')
const electronLocalshortcut = require('electron-localshortcut')
const ElectronStore = require('electron-store');
const path = require('path')

const onlyOne = app.requestSingleInstanceLock();
ElectronStore.initRenderer();

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    mainWindow.removeMenu(); // remove Menu
    // and load the index.html of the app.
    electronLocalshortcut.register(mainWindow, 'F12', () => {
        console.log("F12 is pressed")
        mainWindow.webContents.toggleDevTools()
    })
    electronLocalshortcut.register(mainWindow, 'F5', () => {
        console.log("F5 is pressed")
        mainWindow.reload()
    })
    mainWindow.loadFile('index.html')
}

if (!onlyOne) {
    app.quit();
    app.exit();
} else {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(() => {
        createWindow()
        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })
    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
}
