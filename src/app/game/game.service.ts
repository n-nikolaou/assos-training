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
    this.http.get(`${this.baseUrl}/reviews`).subscribe(
      (next) => {
        // @ts-ignore
        this.reviews = next
        this.uploadReviews();
      },
      (error) => this.reviews = []
    );
   }

  getGames(id: number) {
    if (id !== -1)
      return this.http.get(`${this.baseUrl}/games/${id}`);
    else
      return this.http.get(`${this.baseUrl}/games`);
  }

  getReview(id: number) {
    for (let i = 0; i < this.reviews.length; i++)
      if (this.reviews[i].gameID === id) return this.reviews[i];

    return {gameID: id, stars: [0, 0, 0]};
  }

  getReviews() {
    return this.reviews;
  }

  updateReviews(reviewsGame: Review, id: number) {
    let i;
    if (this.reviews) {
      for (i = 0; i < this.reviews.length; i++)
        if (this.reviews[i].gameID === id) {
          this.reviews[i] = reviewsGame;
          break;
        }

      if (i === this.reviews.length)
        this.reviews.push(reviewsGame);
    }

    this.uploadReviews();
  }

  uploadReviews() {
    const ipc = window.require('electron').ipcRenderer;
    ipc.send('reviewsUpdate', this.reviews);
  }

}
