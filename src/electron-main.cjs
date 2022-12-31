const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const express = require("express");
const mongodb = require("mongodb");

const uri = 'mongodb://localhost:27017';
const databaseName = 'assosDB';
const collectionName = 'reviews';
let reviewsData;

const isDev = process.env.NODE_ENV !== 'production'
const server = express();
server.listen(8001, function () {
  console.log('Listening in 8001');
})

function createWindow () {
  const win = new BrowserWindow({
    width: isDev ? 1800 : 1000,
    height: 900,
    webPreferences: {
      devTools: isDev,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
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

app.on('window-all-closed', async () => {
  const client = new mongodb.MongoClient(uri);
  try {
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    for (let i = 0; i < reviewsData.length; i++)
      await collection.insertOne(reviewsData[i]);
  } catch (e) {
    console.error(e);
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('reviewsUpdate', (event, data) => {
  reviewsData = data;
})
