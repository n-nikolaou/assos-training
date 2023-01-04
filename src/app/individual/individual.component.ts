import {AfterViewInit, Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../game/game.service";
import {Games} from "../models/Games";
import {Content} from "../models/Content";
import {Review} from "../models/Reviews";

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent implements AfterViewInit{
  game: Content;
  reviews: Review;

  index: number;
  id: number;
  currentDifficulty: number;

  showToast: Boolean;
  apiLoaded: boolean;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private gameService: GameService,
  ) {
    this.id = 0;
    this.index = 0;
    this.showToast = false;
    this.currentDifficulty = 0;
    this.apiLoaded = false;
    this.reviews = {gameID: -1, stars: [0, 0, 0]};
    this.game = {id: -1, information: {title: '', multimedia: '', multimediaType: '', mainScreen: []}};

    this.ActivatedRoute.paramMap.subscribe((params) => {
      if (params.get('id') !== null) {
        // @ts-ignore
        this.id = +params.get('id');
        this.reviews.gameID = this.id;
      }

      this.gameService.getGames(this.id).subscribe(
        (next) => {
          // @ts-ignore
          this.game = next
          this.currentDifficulty = this.game.information.mainScreen[this.game.information.mainScreen.length - 1].difficulty;
        },
        (error) => console.error(error)
      );
    });

    this.reviews = this.gameService.getReview(this.id);
  }

  ngAfterViewInit() {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  setDifficulty(n: number) {
    this.currentDifficulty = n;
    this.showToast = false;
  }

  setReview(d: number, s: number) {
    this.showToast = true;
    this.reviews.stars[d] = s;

    this.gameService.updateReviews(this.reviews, this.id);

    setTimeout(() => this.showToast = false, 2000);
  }
}
