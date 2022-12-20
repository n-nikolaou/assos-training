import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MongoClient} from "mongodb";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = "proxy/data-structure.json";

  constructor(private http: HttpClient) { }

  getGames() {
// Connection URI
    const uri =
      "mongodb://localhost:27017";

// Create a new MongoClient
    const client = new MongoClient(uri);

    async function run() {
      try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
    run().catch(console.dir);
    console.log("!");
    return this.http.get(this.baseUrl);
  }
}
