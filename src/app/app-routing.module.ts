import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LastGamesComponent } from './core/features/last-games/last-games.component';
import { StandingComponent } from './core/features/standing/standing.component';
import { HomeComponent } from './core/home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'standing/:country',
    component: StandingComponent,
    // children: [{ path: ':id', component: LastGamesComponent }],
  },
  { path: 'fixtures/:id', component: LastGamesComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
