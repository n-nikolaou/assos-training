import {AfterViewInit, Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../game/game.service";
import {Games} from "../models/Games";
import {Content} from "../models/Content";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements AfterViewInit{
  games: Content[];
  filteredGames: Content[];
  data: Games | undefined;
  showFilter: boolean;
  maxDiff: number;
  titleFilter: string;
  diffFilter: number[];

  constructor(
    private gameService: GameService,
    private ActivatedRoute: ActivatedRoute
    ) {
    this.games = [];
    this.showFilter = false;
    this.maxDiff = 0;
    this.titleFilter = "";
    this.diffFilter = [];
    this.filteredGames = [];

    this.ActivatedRoute.paramMap.subscribe((params) => {
      if (params.get('title') !== null) {
        if (params.get('title') !== 'NULL'){
          // @ts-ignore
          this.titleFilter = params.get('title');
          this.diffFilter = [];
          this.filterGames();
        }
      }
    });

  }

  ngAfterViewInit() {
    this.gameService.getGames(-1).subscribe(
      (next) => {
        //@ts-ignore
        this.data = next;
        if (this.data) {
          for (let k = 0; k < this.data?.cognitiveGames.length; k++) {
            for (let i = 0; i < this.data?.cognitiveGames[k].contents.length; i++) {
              this.games.push(this.data?.cognitiveGames[k].contents[i])
              for (let j = 0; j < this.data?.cognitiveGames[k].contents[i].information.mainScreen.length; j++) {
                if (this.data?.cognitiveGames[k].contents[i].information.mainScreen[j].difficulty > this.maxDiff)
                  this.maxDiff = this.data?.cognitiveGames[k].contents[i].information.mainScreen[j].difficulty;
              }
            }
          }
          this.filterGames();
        }
    },
      (error) => console.error(error)
    );
  }

  setFilters() {
    this.diffFilter = [];
    if (document !== null)
    { // @ts-ignore
      this.titleFilter = document.getElementById("gameTitleInput").value
      //@ts-ignore
      for (let i = 0; i <= this.maxDiff; i++)
        // @ts-ignore
        if (document.getElementById(`flexCheck${i}`).checked)
          // @ts-ignore
          this.diffFilter.push(+document.getElementById(`flexCheck${i}`).value)
    }
    this.filterGames();
    this.showFilter = false;
  }

  filterGames() {
    let matching;
    this.filteredGames = [];
    for (let j = 0; j < this.games.length; j++) {
      matching = true;
      if (this.titleFilter !== "" && !this.games[j].information.title.includes(this.titleFilter)) {
        matching = false;
        continue;
      }

      for (let i = 0; i < this.diffFilter.length; i++) {
        let k;
        for (k = 0; k < this.games[j].information.mainScreen.length; k++)
          if (this.diffFilter[i] === this.games[j].information.mainScreen[k].difficulty)
            break;

        if (k === this.games[j].information.mainScreen.length) {
          matching = false;
          break;
        }
      }

      if (matching) this.filteredGames.push(this.games[j]);
    }
  }
}
