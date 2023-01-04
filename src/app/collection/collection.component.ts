import {AfterViewInit, Component} from '@angular/core';
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
  data: Games | undefined;
  showFilter: boolean;
  maxDiff: number;
  titleFilter: string;
  diffFilter: number[];

  constructor(private gameService: GameService) {
    this.games = [];
    this.showFilter = false;
    this.maxDiff = 0;
    this.titleFilter = "";
    this.diffFilter = [];
  }

  ngAfterViewInit() {
    this.gameService.getGames(-1).subscribe(
      (next) => {
        //@ts-ignore
        this.data = next;
        if (this.data) {
          for (let i = 0; i < this.data?.cognitiveGames[0].contents.length; i++) {
            this.games.push(this.data?.cognitiveGames[0].contents[i])
            for (let j = 0; j < this.data?.cognitiveGames[0].contents[i].information.mainScreen.length; j++)
              if (this.data?.cognitiveGames[0].contents[i].information.mainScreen[j].difficulty > this.maxDiff)
                this.maxDiff = this.data?.cognitiveGames[0].contents[i].information.mainScreen[j].difficulty;
          }
        }
    },
      (error) => console.error(error)
    );
    console.table(this.games);
  }

  setFilters() {
    this.diffFilter = [];
    if (document !== null)
      { // @ts-ignore
        this.titleFilter = document.getElementById("gameTitleInput").value
        for (let i = 0; i <= this.maxDiff; i++)
          { // @ts-ignore
            if (document.getElementById(`flexCheck${i}`).checked)
              { // @ts-ignore
                this.diffFilter.push(document.getElementById(`flexCheck${i}`).value)
              }
          }
        console.log(this.titleFilter);
        console.log(this.diffFilter);
      }
    this.showFilter = false;
  }

}
