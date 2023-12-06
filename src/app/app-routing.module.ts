import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LastGamesComponent } from './core/features/last-games/last-games.component';
import { StandingComponent } from './core/features/standing/standing.component';

const appRoutes: Routes = [
  { path: 'standing', component: StandingComponent, pathMatch: 'full' },
  { path: 'standing/:country', component: StandingComponent },
  { path: 'games/:id', component: LastGamesComponent },
  { path: '**', redirectTo: '/standing' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
