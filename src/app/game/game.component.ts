import {AfterViewInit, Component} from '@angular/core';
import {Games} from "../models/Games";
import {GameService} from "./game.service";
import {Information} from "../models/Information";
import {Content} from "../models/Content";

@Component({
  selector: 'app-root',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {
  data: Games | undefined;
  featuredGames: Content[];

  constructor(private gameService: GameService) {
    this.featuredGames = [];
  }

  ngAfterViewInit(): void {
    this.getGames();
  }

  getGames(): void {
    this.gameService.getGames(-1).subscribe(
      (next) => {
          // @ts-ignore
        this.data = next;
        if (this.data) {
          for (let i = 0; i < this.data?.cognitiveGames[0].contents.length; i++) {
            if (i < 10) this.featuredGames.push(this.data?.cognitiveGames[0].contents[i]);
          }
        }
      },
      (error) => console.log(error)
    )
  }

  scrollToElement($element: HTMLDivElement): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}
