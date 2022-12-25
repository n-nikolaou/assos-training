import http from "http";
import mongodb, {Collection} from "mongodb";
import {Games} from "./app/models/Games";

export class GamesLoaderModule {
  private uri = 'mongodb://localhost:27017';
  private databaseName = 'assosDB';
  private collectionName = 'games';
  private isInit: mongodb.WithId<mongodb.Document> | null | undefined;
  private data: any | null;

  constructor() {
    this.run().catch(console.dir)
  }

  private async getGamesFromEndpoint(collection: Collection) {
    let str = '';

    const options = {
      host: 'medresearch1.med.auth.gr',
      path: '/exercise/data-structure.json'
    };

    let callback = (response: any) => {
      //another chunk of data has been received, so append it to `str`
      response.on('data', function (res: any) {
        str += res;
      });

      //the whole response has been received, so we just print it out here
      response.on('end', async () => {
        console.log('The request has ended');

        const data = JSON.parse(str);
        if (data && this.isInit !== null) {
          try {
            for (let i = 0; i < data?.cognitiveGames[0].contents.length; i++) {
              await collection.insertOne(data?.cognitiveGames[0].contents[i].information)
            }
          } catch (e) {
            console.error(e);
          }
        }
      });
    }

    let request = await http.get(options, callback)
  }

  private async getGamesFromDB(collection: Collection) {
    try {
      return await collection.find({"title": {$exists: true}}).toArray();
    } catch (e) {
      console.error(e);
      return null
    }
  }

  private async run() {
    const client = new mongodb.MongoClient(this.uri);
    try {
      const database = client.db(this.databaseName);
      const collection = database.collection(this.collectionName);
      this.isInit = await collection.findOne({
        isInit: true
      })
      if (!this.isInit) {
        await collection.insertOne({
          isInit: true
        })
        await this.getGamesFromEndpoint(collection);
      }
      this.data = await this.getGamesFromDB(collection);
      console.table(this.data);
    } catch (e) {
      console.error(e);
    }
  }

  getGames() {return this.data;}
}

