import {AfterViewInit, Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../game/game.service";
import {Information} from "../models/Information";
import {Games} from "../models/Games";
import {Content} from "../models/Content";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  currentDifficulty: number;
  showToast: Boolean;
  reviews: Number[];
  safeURL: SafeResourceUrl | undefined;
  apiLoaded: boolean;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private gameService: GameService,
    private domSanitizer: DomSanitizer
  ) {
    this.games = [];
    this.id = 0;
    this.index = 0;
    this.currentDifficulty = 0;
    this.showToast = false;
    this.apiLoaded = false;
    this.reviews = [];
    for (let i = 0; i < 3; i++) {
      this.reviews.push(0);
    }

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

    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  setDifficulty(n: number) {
    this.currentDifficulty = n;
    console.log(this.currentDifficulty);
  }

  setReview(d: number, s: number) {
    this.showToast = true;
    this.reviews[d] = s;
  }
}
