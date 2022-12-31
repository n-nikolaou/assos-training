import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Review} from "../models/Reviews";
import {ipcRenderer} from 'electron'

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = "http://localhost:8000";
  private reviews: Review[];

  constructor(private http: HttpClient) {
    this.reviews = [];
   }

  getGames() {
    return this.http.get(`${this.baseUrl}/games`);
  }

  getReviews() {
   return this.http.get(`${this.baseUrl}/reviews`);
  }

  uploadReviews(reviewsGame: number[], id: number) {
    let i;
    for (i = 0; i < this.reviews.length; i++)
      if (this.reviews[i].gameID === id) {
        this.reviews[i].stars = reviewsGame;
        break;
      }

    if (i === this.reviews.length)
      this.reviews.push({gameID: id, stars: reviewsGame});

    const ipc = window.require('electron').ipcRenderer;
    ipc.send('reviewsUpdate', this.reviews);
  }

}
