import electron, { ipcMain } from "electron"
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer"
import buildMenu from "./electron/menu"
import isDev from "./electron/isDev"

import './electron/minecraft'
import './electron/updater'

const app = electron.app || electron.remote.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
    if (isDev) {
        installExtension(REACT_DEVELOPER_TOOLS)
        installExtension(REDUX_DEVTOOLS)
    }

    mainWindow = new BrowserWindow({
        width: 400,
        height: 550,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    if (isDev) {
      mainWindow.openDevTools()
    }

    if (isDev) {
        mainWindow.loadURL("http://localhost:8080")
    } else {
        mainWindow.loadFile("./build/index.html")
    }

    mainWindow.on("closed", () => (mainWindow = null))
    
    buildMenu(mainWindow)
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow()
    }
})

ipcMain.once('app:exit', () => app.exit())