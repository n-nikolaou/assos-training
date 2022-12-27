import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from "./game/game.component";
import {IndividualComponent} from "./individual/individual.component";

const routes: Routes = [
  { path: '', component: GameComponent},
  { path: 'game/:id', component: IndividualComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
