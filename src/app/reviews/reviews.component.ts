import { AfterViewInit, Component } from '@angular/core';
import { GameService } from '../game/game.service';
import { Content } from '../models/Content';
import { Games } from '../models/Games';
import { Review } from '../models/Reviews';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements AfterViewInit {
  reviews: Review[];
  table: {
    gameID: number,
    title: string,
    difficulty: number,
    stars: number
  }[];
  games: Content[];
  data: Games | undefined;
  indexes: number[];

  constructor(private gameService: GameService) {
    this.games = [];
    this.reviews = this.gameService.getReviews();
    this.indexes = [];
    this.table = [];
  }

  ngAfterViewInit(): void {
    this.gameService.getGames(-1).subscribe(
      (next) => {
        //@ts-ignore
        this.data = next;
        if (this.data) {
          for (let j = 0; j < this.data?.cognitiveGames.length; j++) {
            for (let i = 0; i < this.data?.cognitiveGames[j].contents.length; i++) {
              this.games.push(this.data?.cognitiveGames[j].contents[i])
              this.indexes[this.games[i].id] = i;
            }
          }
        }
        for (let i = 0; i < this.reviews.length; i++) {
          for (let j = 0; j < this.reviews[i].stars.length; j++) {
            if (this.reviews[i].stars[j] != 0) this.table.push({
              gameID: this.reviews[i].gameID,
              title: this.games[this.indexes[this.reviews[i].gameID]].information.title,
              difficulty: j,
              stars: this.reviews[i].stars[j]
            });
          }
        }
    },
      (error) => console.error(error)
    );
  }
}
