import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Games} from "../models/Games";
import {GameService} from "./game.service";
import {Content} from "../models/Content";
import {Information} from "../models/Information";

@Component({
  selector: 'app-root',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {
  data: Games | undefined;
  games: Information[];

  constructor(private gameService: GameService) {
    this.games = [];
  }

  ngAfterViewInit(): void {
    this.getGames();
  }

  getGames(): void {
    const obs = this.gameService.getGames();
    obs.subscribe(
      (next) => {
          // @ts-ignore
        this.data = next;
        if (this.data) {
          for (let i = 0; i < this.data?.cognitiveGames[0].contents.length; i++) {
            this.games.push(this.data?.cognitiveGames[0].contents[i].information)
          }
        }
        console.table(this.games);
      },
      (error) => console.log(error)
    )
  }
}
