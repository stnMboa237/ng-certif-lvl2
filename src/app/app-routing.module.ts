import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FixturesComponent } from './core/features/fixtures/fixtures.component';
import { StandingComponent } from './core/features/standing/standing.component';
import { HomeComponent } from './core/home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'standing/:country',
    component: StandingComponent,
    // children: [{ path: ':id', component: LastGamesComponent }],
  },
  { path: 'fixtures/:id', component: FixturesComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
