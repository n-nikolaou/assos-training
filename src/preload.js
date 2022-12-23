const { contextBridge, net } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
})

const mongodb = require('mongodb');
const uri = 'mongodb://localhost:27017';

function fillArray(str) {
  const data = JSON.parse(str);
  if (data) {
    let games = []
    for (let i = 0; i < data?.cognitiveGames[0].contents.length; i++) {
      games.push(data?.cognitiveGames[0].contents[i].information)
    }
    return games;
  } else
    return null
}

function getGames() {
  let games = [];
  let str = '';

  const http = require('http');

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
    response.on('end', function () {
      console.log('The request has ended');
      games = fillArray(str);
      console.table(games)
      if (!games) console.error('No input given')
    });
  }

  let request = http.get(options, callback)
  console.log(request)
  return games;
}

const client = new mongodb.MongoClient(uri);
async function run() {
  try {
    const database = client.db("insertDB");
    const haiku = database.collection("haiku");
    const isInit = await haiku.findOne({
      title: "initialized"
    })
    if (!isInit) await haiku.insertOne({
      title: "initialized"
    })
    const games = getGames();
    console.table(games)

    // create a document to insert
    for (let i = 0; i < games.length; i++) {
      const res = await haiku.insertOne(games[i])
      console.log(res)
    }
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
