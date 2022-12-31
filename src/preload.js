const {contextBridge, ipcRenderer, ipcMain} = require('electron');
const mongodb = require('mongodb');
const http = require('http');
const express = require('express');

// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
// })

window.ipcRenderer = require('electron').ipcRenderer;

const uri = 'mongodb://localhost:27017';
const databaseName = 'assosDB';
const collectionName = 'games';
const serverPort = 8000;
let isInit;

async function fillDB(str, collection) {
  const data = JSON.parse(str);
  if (data && !isInit) {
    try {
      await collection.insertOne(data);
      for (let i = 0; i < data?.cognitiveGames[0].contents.length; i++) {
        await collection.insertOne(data?.cognitiveGames[0].contents[i])
      }
    } catch (e) {
      console.error(e);
    }
  }
}

async function getGamesFromEndpoint(collection) {
  let str = '';

  const options = {
    host: 'medresearch1.med.auth.gr',
    path: '/exercise/data-structure.json'
  };

  let callback = function (response) {
    //another chunk of data has been received, so append it to `str`
    response.on('data', function (res) {
      str += res;
    });

    //the whole response has been received, so we just print it out here
    response.on('end', async function () {
      console.log('The request has ended');
      await fillDB(str, collection);
    });
  }

  let request = await http.get(options, callback)
}

async function getGamesFromDB(collection) {
  try {
    const raw = await collection.findOne({"version": {$exists: true}});
    const games = await collection.find({"id": {$exists: true}}).toArray();
    return [games, raw];
  } catch (e) {
    console.error(e);
  }
}

async function uploadOnServer(games, raw, reviews) {
  const app = express();
  app.listen(serverPort, function () {
    console.log('Listening on ' + serverPort + '.')
  })

  app.route('/').get((req, res) => {
    res.send("Recognized endpoints on this server include '/games', '/games/ids' and '/games/ID'.")
  })
  app.route('/games').get((req, res) => {
    res.status(200).type('json').send(JSON.stringify(raw, null, 2) + '\n');
  })
  app.route('/games/ids').get((req, res) => {
    let avIDS = [];
    for (let i = 0; i < games.length; i++) {
      avIDS.push(games[i].id);
    }
    res.status(200).type('json').send('{\n' + '"ids:"\n' + JSON.stringify(avIDS, null, 2) + '\n}');
  })
  app.route('/games/:ID').get((req, res) => {
    const ID = req.params['ID'];
    let i;
    for (i = 0; i < games.length; i++) {
      if (games[i].id === +ID) {
        res.status(200).type('json').send(JSON.stringify(games[i], null, 2) + '\n');
        break;
      }
    }
    if (i === games.length) {
      res.status(404);
      res.send("There's no game with given id");
    }
  })
  app.route('/reviews').get((req, res) => {
    if (reviews)
      res.status(200).type('json').send(JSON.stringify(reviews, null, 2) + '\n');
    else
      res.status(200).type('json').send('{' + '\n' + '"reviews": []' + '\n}');
  })
}

async function run() {
  const client = new mongodb.MongoClient(uri);
  try {
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    isInit = await collection.findOne({
      isInit: true
    })
    if (!isInit) {
      await collection.insertOne({
        isInit: true
      })
      await getGamesFromEndpoint(collection);
    }
    const reviews = await collection.findOne({"reviews": {$exists: true}});
    const result = await getGamesFromDB(collection)
    const games = result[0];
    const raw = result[1];
    await uploadOnServer(games, raw, reviews);

    ipcMain.on('reviewsUpdate', (event, data) => {
      console.log(data);
    })
  } catch (e) {
    console.error(e);
  }
}
run().catch(console.dir);
