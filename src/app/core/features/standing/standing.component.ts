import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { StandingService } from 'src/app/shared/service/standing.service';

@Component({
  selector: 'ng-standing',
  template: `
    <ng-container *ngIf="standing$ | async as standing">
      <div class="row standing-table">
        <div class="col-xs-12">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col">Name</th>
                <th scope="col">Games</th>
                <th scope="col">W</th>
                <th scope="col">L</th>
                <th scope="col">D</th>
                <th scope="col">Goal Difference</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="team-row"
                *ngFor="let teamStandingInfo of standing"
                (click)="onSelectTeam(teamStandingInfo.teamId)"
              >
                <td>{{ teamStandingInfo.rank }}</td>
                <td>
                  <img
                    class="img-responsive"
                    [src]="teamStandingInfo.logo"
                    alt="team-logo"
                    width="30px"
                  />
                </td>
                <td>{{ teamStandingInfo.teamName }}</td>
                <td>{{ teamStandingInfo.games }}</td>
                <td>{{ teamStandingInfo.win }}</td>
                <td>{{ teamStandingInfo.lose }}</td>
                <td>{{ teamStandingInfo.draw }}</td>
                <td>{{ teamStandingInfo.goalDifference }}</td>
                <td>{{ teamStandingInfo.points }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['./standing.component.css'],
})
export class StandingComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly StandingService = inject(StandingService);
  private readonly router = inject(Router);
  protected defaultCountry: string = 'England';

  protected selectedCountry$: Observable<string | null> =
    this.activatedRoute.paramMap.pipe(
      map((params: ParamMap): string | null => {
        const country = params.get('country');
        if (country) {
          return country;
        }
        return this.defaultCountry;
      })
    );

  protected year$: Observable<number> =
    this.StandingService.getCurrentSeasonYear();

  protected leagueId$: Observable<number> = combineLatest({
    countryName: this.selectedCountry$,
  }).pipe(
    switchMap(({ countryName }) =>
      this.StandingService.getLeagueId(countryName!)
    )
  );

  protected seasonYear$: Observable<number> =
    this.StandingService.getCurrentSeasonYear();

  protected standing$: Observable<any> = combineLatest({
    id: this.leagueId$,
    season: this.seasonYear$,
  }).pipe(
    switchMap(({ id, season }) =>
      this.StandingService.getLeagueStanding(id, season)
    )
  );

  onSelectTeam(teamId: number) {
    this.router.navigate(['/fixture', teamId]);
  }
}
