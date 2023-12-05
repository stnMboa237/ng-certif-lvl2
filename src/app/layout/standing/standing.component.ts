import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { LeagueUpdateService } from 'src/app/shared/service/league-update.service';

@Component({
  selector: 'ng-standing',
  template: `
    <hr />
    <div *ngIf="selectedCountry$ | async as country">
      <h3>country: {{ country }}</h3>
    </div>

    <div *ngIf="leagueId$ | async as leagueId">
      <h3>leagueId: {{ leagueId }}</h3>
    </div>
    <hr />
    <div *ngIf="standing$ | async as standing">
      <h3>standing</h3>
      <h4>{{ standing | json }}</h4>
    </div>
  `,
  styleUrls: ['./standing.component.css'],
})
export class StandingComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly leagueUpdateService = inject(LeagueUpdateService);
  protected defaultCountry: string = 'England';

  protected selectedCountry$: Observable<string | null> =
    this.activatedRoute.paramMap.pipe(
      map((params: ParamMap): string | null => {
        const country = params.get('country');
        return country !== null ? country : this.defaultCountry;
      })
    );

  protected year$: Observable<number> =
    this.leagueUpdateService.getCurrentSeasonYear();

  protected leagueId$: Observable<number> = combineLatest({
    countryName: this.selectedCountry$,
  }).pipe(
    switchMap(({ countryName }) =>
      this.leagueUpdateService.getLeagueId(countryName!)
    )
  );

  protected seasonYear$: Observable<number> =
    this.leagueUpdateService.getCurrentSeasonYear();

  protected standing$: Observable<any> = combineLatest({
    id: this.leagueId$,
    season: this.seasonYear$,
  }).pipe(
    switchMap(({ id, season }) =>
      this.leagueUpdateService.getLeagueStanding(id, season)
    )
  );
}
