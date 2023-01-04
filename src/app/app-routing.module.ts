import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from "./game/game.component";
import {IndividualComponent} from "./individual/individual.component";
import {CollectionComponent} from "./collection/collection.component";
import { ReviewsComponent } from './reviews/reviews.component';

const routes: Routes = [
  { path: '', component: GameComponent},
  { path: 'game/:id', component: IndividualComponent },
  { path: 'search/:title', component: CollectionComponent },
  { path: 'reviews', component: ReviewsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
