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
  games: Content[];
  data: Games | undefined;
  indexes: number[];

  constructor(private gameService: GameService) {
    this.games = [];
    this.reviews = this.gameService.getReviews();
    this.indexes = [];
    console.table(this.reviews);
  }

  ngAfterViewInit(): void {   
    console.log("aaaaaaaaaa"); 
    this.gameService.getGames(-1).subscribe(
      (next) => {
        //@ts-ignore
        this.data = next;
        console.log("!!!");
        if (this.data) {
          for (let i = 0; i < this.data?.cognitiveGames[0].contents.length; i++) {
            this.games.push(this.data?.cognitiveGames[0].contents[i])
            console.table(this.games[i].id);
            this.indexes[this.games[i].id] = i;
          }
        }
    },
      (error) => console.error(error)
    );
  }
}
