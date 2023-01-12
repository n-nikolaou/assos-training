const {contextBridge, ipcRenderer, ipcMain} = require('electron');
const mongodb = require('mongodb');
const http = require('http');
const express = require('express');

window.ipcRenderer = require('electron').ipcRenderer;

const uri = 'mongodb://localhost:27017';
const databaseName = 'assosDB';
const serverPort = 8000;
let initialized = false;
let timeInit = new Date();

/**
 * Fills database with data (games) that gets from the parameters
 * and individual games
 * @param str the data from endpoint
 * @param database the database to be filled
 * @returns {Promise<void>}
 */
async function fillDB(str, database) {
  await database.collection('games').drop(function(err, delOK) {
    if (err) throw err;
  });

  const collection = database.collection('games');

  const data = JSON.parse(str);
  if (data) {
    try {
      await collection.insertOne(data);
      for (let j = 0; j < data?.cognitiveGames.length; j++)
        for (let i = 0; i < data?.cognitiveGames[j].contents.length; i++) {
          await collection.insertOne(data?.cognitiveGames[j].contents[i])
        }
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * Gets data (games) from given endpoint and calls function
 * to fill a database with retrieved data
 * @param database the database to be filled
 * @returns {Promise<void>}
 */
async function getGamesFromEndpoint(database) {
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
      await fillDB(str, database);
    });
  }

  let request = await http.get(options, callback)
}

/**
 * Finds data (games) in given database and returns them.
 * If a certain time has passed (60 minutes) since the initialization of the app
 * the function retrieves the data again from given endpoint
 * @param database the database to be searched
 * @returns {Promise<*[]>} the games
 */
async function getGamesFromDB(database) {
  let raw, games;
  const collection = database.collection('games');

  if (initialized) {
    const timeNow = new Date();
    if ((timeNow.getMinutes() + timeNow.getHours() * 60) - (timeInit.getMinutes() + timeNow.getHours() * 60) > 60) {
      timeInit = timeNow;
      await getGamesFromEndpoint(database);
    }
  } else {
    initialized = true;
    await getGamesFromEndpoint(database);
  }
  try {
    while ((await collection.findOne({"id": 30})) === null)
      setTimeout(() => console.log('Loading'), 2000);

    raw = await collection.findOne({"version": {$exists: true}});
    games = await collection.find({"id": {$exists: true}}).toArray();
    return [games, raw];
  } catch (e) {
    console.error(e);
  }
}

/**
 * Finds data (reviews) from given collection of a specific database and returns them
 * @param collection the collection to be searched
 * @returns {Promise<*>} the reviews
 */
async function getReviewsFromDB(collection) {
  try {
    return await collection.find({"stars": {$exists: true}}).toArray();
  } catch (e) {
    console.error(e);
  }
}

/**
 * Uploads on a middleware (server on localhost) games and reviews retrieved by database, so they
 * can be accessed from the components in Angular app.
 * @param database the database that contains the data
 * @param reviews the reviews to be uploaded
 * @returns {Promise<void>}
 */
async function uploadOnServer(database, reviews) {
  const app = express();
  app.listen(serverPort, function () {
    console.log('Listening on ' + serverPort + '.')
  })

  let games;

  app.route('/').get((req, res) => {
    res.send("Recognized endpoints on this server include '/games', '/games/ID', '/reviews' and '/reviews/ID'.")
  })
  app.route('/games').get(async (req, res) => {
    let result = await getGamesFromDB(database);
    res.status(200).type('json').send(JSON.stringify(result[1], null, 2) + '\n');
  })
  app.route('/games/:ID').get(async (req, res) => {
    let result = await getGamesFromDB(database);
    games = result[0];

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
  app.route('/reviews/:ID').get((req, res) => {
    const ID = req.params['ID'];
    let i;
    for (i = 0; i < reviews.length; i++) {
      if (reviews[i].gameID === +ID) {
        res.status(200).type('json').send(JSON.stringify(reviews[i], null, 2) + '\n');
        break;
      }
    }
    if (i === reviews.length) {
      res.status(404);
      res.send("There's no reviews for a game with given id");
    }
  })
}

/**
 * Initializes the app with data
 * @returns {Promise<void>}
 */
async function run() {
  const client = new mongodb.MongoClient(uri);
  try {
    const database = client.db(databaseName);
    const collection = database.collection('reviews');
    const reviews = await getReviewsFromDB(collection);

    await uploadOnServer(database, reviews);
  } catch (e) {
    console.error(e);
  }
}
run().catch(console.dir);
