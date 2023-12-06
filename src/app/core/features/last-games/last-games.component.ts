import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { Fixture } from 'src/app/models/fixture.interface';
import { FixtureService } from 'src/app/shared/service/fixture.service';
import { StandingService } from 'src/app/shared/service/standing.service';

@Component({
  selector: 'ng-last-games',
  template: `
    <div class="row game-table">
      <div class="col-xs-12 col-md-12">
        <div *ngIf="lastFixtures$ | async as fixtures">
          <table class="table borderless">
            <tbody>
              <tr *ngFor="let fixture of fixtures">
                <td>
                  <img [src]="fixture.homeLogo" alt="team-logo" width="30px" />
                </td>
                <td>{{ fixture.homeTeamName }}</td>
                <td>{{ fixture.homeGoals }}</td>
                <td>-</td>
                <td>{{ fixture.awayGoals }}</td>
                <td>{{ fixture.awayTeamName }}</td>
                <td>
                  <img [src]="fixture.awayLogo" alt="team-logo" width="30px" />
                </td>
              </tr>
            </tbody>
          </table>

          <button class="btn btn-primary" type="button" (click)="goBack()">
            Back
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./last-games.component.css'],
})
export class LastGamesComponent {
  private readonly standingService = inject(StandingService);
  private readonly fixtureService = inject(FixtureService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected seasonYear$: Observable<number> =
    this.standingService.getCurrentSeasonYear();

  protected teamId$: Observable<number | null> =
    this.activatedRoute.paramMap.pipe(
      map((params: ParamMap): number | null => {
        const routeData = params.get('id');
        if (routeData) {
          return +routeData;
        }
        return null;
      })
    );

  protected lastFixtures$: Observable<Fixture[]> = combineLatest({
    year: this.seasonYear$,
    id: this.teamId$,
  }).pipe(
    switchMap(({ year, id }) => this.fixtureService.getLastGames(id!, year))
  );

  goBack() {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
