import {AfterViewInit, Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../game/game.service";
import {Information} from "../models/Information";
import {Games} from "../models/Games";
import {Content} from "../models/Content";

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent implements AfterViewInit{
  games: Content[];
  id: number;
  data: Games | undefined;
  index: number;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private gameService: GameService
  ) {
    this.games = [];
    this.id = 0;
    this.index = 0;

    const obs = this.gameService.getGames();
    obs.subscribe(
      (next) => {
        // @ts-ignore
        this.data = next;
        if (this.data) {
          for (let i = 0; i < this.data?.cognitiveGames[0].contents.length; i++) {
            this.games.push(this.data?.cognitiveGames[0].contents[i])
          }
        }
      },
      (error) => console.log(error)
    )
  }

  ngAfterViewInit() {
    const obs = this.ActivatedRoute.paramMap.subscribe((params) => {
      if (params.get('id') !== null) {
        // @ts-ignore
        this.id = +params.get('id');
      }
      console.log(this.id);
      for (let i = 0; i < this.games.length; i++) {
        if (this.games[i].id === this.id) {
          this.index = i;
          break;
        }
      }
    });
  }
}
