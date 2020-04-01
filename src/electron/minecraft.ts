import electron, { ipcMain, BrowserWindow, IpcMainEvent } from 'electron'
import {
    MinecraftClient,
    InstallationProgress,
    Authentication,
    LaunchOptions
} from '@eneris/minecraft-client'

import path from 'path'

import mcping from './mcping'

export declare interface MinecraftStartArgs extends LaunchOptions {
    version: string,
    username: string,
    autoConnect: boolean,
    memory: string
}

export declare interface ServerAddress {
    host: string,
    port?: number
}

const app = electron.app || electron.remote.app
let game = null

const appDir = app.getPath('userData')
const mcDir = path.join(appDir, '.minecraft')

ipcMain.on('mc:start', async (e: IpcMainEvent, args: MinecraftStartArgs) => {
    const currentWindow = BrowserWindow.getAllWindows()[0]
    try {
        console.log('mc:start', args)

        let step = null
        let client = await MinecraftClient.getMinecraftClient(args.version, {
            gameDir: mcDir
        }, InstallationProgress.callback(
            currentStep => (step = currentStep),
            progress => {
                //Progress Callback (in %)
                console.log('Progress', step, progress)
                currentWindow.webContents.send('mc:progress', {
                    progress: Math.round(progress * 10000) / 100,
                    step
                })
                currentWindow.setProgressBar(progress)
            }
        ))

        let installOk = false
        let attemptCounter = 1;
        while (!installOk) {
            try {
                await client.checkInstallation()
                installOk = true
            } catch (e) {
                attemptCounter = attemptCounter + 1
                console.error(e)

                if (attemptCounter >= 10) {
                    throw e
                }
            }
        }

        if (args.server && args.server.host) {
            await client.ensureServersDat(args.server)
        }

        currentWindow.setProgressBar(-1)

        game = await client.launch(Authentication.offline(args.username), {
            redirectOutput: false,
            resolution: args.resolution,
            server: args.autoConnect && args.server,
            memory: args.memory
        })

        currentWindow.webContents.send('mc:ingame', {ingame: true})

        game.stdout.on('data', (data) => {
            data = data.toString()
            console.log(data)
            currentWindow.webContents.send('mc:log', data)
        })
            
        game.stderr.on('data', (data) => {
            data = data.toString()
            console.error(data)
            currentWindow.webContents.send('mc:error', data)
        })
            
        game.on('close', (code) => {
            console.log(`Exited with code: ${code}`)
            currentWindow.webContents.send('mc:ingame', {ingame: false, code})
        })
    } catch (err) {
        console.error(err)
        currentWindow.webContents.send('mc:fatal', err.message)
    }
})

ipcMain.on('mc:ping', async (e: IpcMainEvent, args: ServerAddress) => {
    console.log('mc:ping', args)
    const currentWindow = BrowserWindow.getAllWindows()[0]
    mcping(args.host, args.port, (err, data) => currentWindow.webContents.send('mc:pong', {err, data}))
})

ipcMain.on('mc:close', () => {
    if (game) {
        game.kill('SIGTERM')
        game = null
    }
})