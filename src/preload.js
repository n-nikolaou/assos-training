const contextBridge = require('electron').contextBridge;
const mongodb = require('mongodb');
const http = require('http');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})

const uri = 'mongodb://localhost:27017';
const databaseName = 'assosDB';
const collectionName = 'games';
let isInit;

async function fillDB(str, collection) {
  const data = JSON.parse(str);
  if (data && !isInit) {
    try {
      for (let i = 0; i < data?.cognitiveGames[0].contents.length; i++) {
        await collection.insertOne(data?.cognitiveGames[0].contents[i].information)
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
    return await collection.find({"title": {$exists: true}}).toArray();
  } catch (e) {
    console.error(e);
  }
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
    const games = await getGamesFromDB(collection);
    console.table(games);
  } catch (e) {
    console.error(e);
  }
}
run().catch(console.dir);
