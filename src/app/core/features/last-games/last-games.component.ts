import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { GameService } from 'src/app/shared/service/game.service';
import { StandingService } from 'src/app/shared/service/standing.service';

@Component({
  selector: 'ng-last-games',
  template: `
    <div class="row game-table">
      <div class="col-xs-12 col-md-12">
        <div *ngIf="teamId$ | async as id">
          <h4>Team Id = {{ id }}</h4>
        </div>

        <div *ngIf="lastGames$ | async as games">
          <h4>{{ games | json }}</h4>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./last-games.component.css'],
})
export class LastGamesComponent {
  private readonly standingService = inject(StandingService);
  private readonly gameService = inject(GameService);
  private readonly activatedRoute = inject(ActivatedRoute);

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

  protected lastGames$: Observable<any> = combineLatest({
    year: this.seasonYear$,
    id: this.teamId$,
  }).pipe(
    switchMap(({ year, id }) => this.gameService.getLastGames(id!, year))
  );
}
