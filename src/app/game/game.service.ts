import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = "http://medresearch1.med.auth.gr/exercise/data-structure.json";

  constructor(private http: HttpClient) { }

  getGames() {
    return this.http.get(this.baseUrl);
  }
}
