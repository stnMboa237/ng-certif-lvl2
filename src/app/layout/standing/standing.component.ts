import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EMPTY, Observable, map } from 'rxjs';
import { LeagueUpdateService } from 'src/app/shared/service/league-update.service';

@Component({
  selector: 'ng-standing',
  template: `
    <hr />
    <div *ngIf="selectedCountry$ | async as country">
      <h3>country: {{ country }}</h3>
    </div>
  `,
  styleUrls: ['./standing.component.css'],
})
export class StandingComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly leagueUpdateService = inject(LeagueUpdateService);

  protected selectedCountry$: Observable<string | null> = EMPTY;

  protected year$: Observable<number> =
    this.leagueUpdateService.getCurrentSeasonYear();

  ngOnInit(): void {
    this.selectedCountry$ = this.activatedRoute.paramMap.pipe(
      map((params: ParamMap): string | null => {
        return params.get('country');
      })
    );
  }
}
