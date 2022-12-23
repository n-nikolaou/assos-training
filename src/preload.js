const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})

const mongodb = require('mongodb');
const uri = 'mongodb://localhost:27017';
let isInit;

async function fillDB(str, collection) {
  const data = JSON.parse(str);
  if (data && !isInit) {
    const client = new mongodb.MongoClient(uri);
    try {
      const database = client.db("insertDB");
      const haiku = database.collection("haiku");
      for (let i = 0; i < data?.cognitiveGames[0].contents.length; i++) {
        await haiku.insertOne(data?.cognitiveGames[0].contents[i].information)
      }
    } finally {
      client.close();
    }
  }
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
      fillDB(str);
      if (!games) console.error('No input given')
    });
  }

  let request = http.get(options, callback)
  console.log(request)
  return games;
}

async function run() {
  const client = new mongodb.MongoClient(uri);
  try {
    const database = client.db("insertDB");
    const haiku = database.collection("haiku");
    isInit = await haiku.findOne({
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
