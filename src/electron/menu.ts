// @flow
import {Menu} from "electron"
import isDev from "./isDev"

function buildMenu(mainWindow) {
    if (isDev) {
        setupDevelopmentEnvironment(mainWindow)
    }

    const template =
        process.platform === 'darwin'
            ? buildDarwinTemplate()
            : buildDefaultTemplate()

    const menu = Menu.buildFromTemplate(template)

    Menu.setApplicationMenu(menu)

    return menu
}

function setupDevelopmentEnvironment(mainWindow) {
    mainWindow.openDevTools()
    mainWindow.webContents.on('context-menu', (e, props) => {
        const { x, y } = props

        Menu.buildFromTemplate([
            {
                label: 'Inspect element',
                click: () => {
                    mainWindow.inspectElement(x, y)
                }
            }
        ]).popup(mainWindow)
    })
}

function buildDarwinTemplate() {
    return []
}

function buildDefaultTemplate() {
    return []
}

export default buildMenu