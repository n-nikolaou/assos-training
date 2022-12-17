import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = "proxy/data-structure.json";

  constructor(private http: HttpClient) { }

  getGames() {
    console.log("!")
    return this.http.get(this.baseUrl);
  }
}
