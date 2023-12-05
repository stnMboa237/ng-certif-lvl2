import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandingComponent } from './layout/standing/standing.component';

const appRoutes: Routes = [
  { path: 'standing', component: StandingComponent, pathMatch: 'full' },
  { path: 'standing/:country', component: StandingComponent },
  { path: '**', redirectTo: '/standing' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
