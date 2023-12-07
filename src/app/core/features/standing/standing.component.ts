import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { Country } from 'src/app/models/country.interface';
import { DefaultCountry } from 'src/app/models/default-country.interface';
import { TeamStandingInfo } from 'src/app/models/team-standing-info.interface';
import { StandingService } from 'src/app/shared/service/standing.service';
import { environment } from 'src/environments/environment.development';

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
              <tr class="team-row" *ngFor="let teamStandingInfo of standing">
                <td>{{ teamStandingInfo.rank }}</td>
                <td>
                  <img
                    class="img-responsive"
                    [src]="teamStandingInfo.logo"
                    alt="team-logo"
                    width="30px"
                  />
                </td>
                <td>
                  <a (click)="onSelectTeam(teamStandingInfo.teamId)">{{
                    teamStandingInfo.teamName
                  }}</a>
                </td>
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
  protected noCountry: string = '';

  protected countries$: Observable<Country[]> =
    this.StandingService.getCountries();

  protected country$: Observable<string> = this.activatedRoute.paramMap.pipe(
    map((params: ParamMap): string => {
      const country = params.get('country');
      if (country) {
        return country;
      }
      return this.noCountry;
    })
  );

  protected selectedCountry$: Observable<string> = combineLatest({
    countries: this.countries$,
    country: this.country$,
  }).pipe(
    map(({ countries, country }) => {
      let result: string = '';
      countries.forEach((element) => {
        if (element.name.toLowerCase() === country.toLowerCase()) {
          result = element.name;
          return element.name;
        }
        return result;
      });
      return result;
    })
  );

  protected year$: Observable<number> =
    this.StandingService.getCurrentSeasonYear();

  protected leagueId$: Observable<number> = combineLatest({
    countryName: this.selectedCountry$,
  }).pipe(
    switchMap(({ countryName }) => {
      const leagueDescription = environment.defaultCountriesList.find(
        (c: DefaultCountry) => c.name === countryName.toLowerCase()
      )?.league;
      return this.StandingService.getLeagueId(countryName, leagueDescription);
    })
  );

  protected seasonYear$: Observable<number> =
    this.StandingService.getCurrentSeasonYear();

  protected standing$: Observable<TeamStandingInfo[]> = combineLatest({
    id: this.leagueId$,
    season: this.seasonYear$,
  }).pipe(
    switchMap(({ id, season }) =>
      this.StandingService.getLeagueStanding(id, season)
    )
  );

  onSelectTeam(teamId: number) {
    const url = this.router.routerState.snapshot.url;
    localStorage.setItem('previousUrl', JSON.stringify(url));
    this.StandingService.previousUrl$.next(url);
    this.router.navigate(['/fixtures', teamId]);
  }
}
