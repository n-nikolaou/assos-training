import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import {HttpClientModule} from "@angular/common/http";
import {GameService} from "./game/game.service";
import { IndividualComponent } from './individual/individual.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    IndividualComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    YouTubePlayerModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
