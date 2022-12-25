const { app, BrowserWindow } = require('electron')
const path = require('path')

const MongoClient = require('mongodb').MongoClient
const isDev = process.env.NODE_ENV !== 'production'

function createWindow () {
  const win = new BrowserWindow({
    width: isDev ? 1800 : 1000,
    height: 900,
    webPreferences: {
      devTools: isDev,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./dist/assos-training/index.html')
  if (isDev) win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }

    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
