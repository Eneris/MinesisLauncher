import electron, { session, shell } from "electron"

const app = electron.app || electron.remote.app

app.on('ready', () => {
  session.defaultSession.on('will-download', (event, item, webContents) => {
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
        webContents.send('updater:error')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
          webContents.send('updater:progress', 'Paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
          webContents.send('updater:progress', Math.ceil((item.getReceivedBytes() / item.getTotalBytes()) * 10000) / 100)
        }
      }
    })

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        webContents.send('updater:done')
        const savePath = item.getSavePath()
        shell.openItem(savePath)
        app.quit()
      } else {
        console.log(`Download failed: ${state}`)
        webContents.send('updater:error', state)
      }
    })
  })
})
