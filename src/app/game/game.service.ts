import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = "http://localhost:8000/games";

  constructor(private http: HttpClient) { }

  getGames() {
    return this.http.get(this.baseUrl);
  }
}
