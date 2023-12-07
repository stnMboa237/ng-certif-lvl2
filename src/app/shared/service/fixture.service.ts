import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, catchError, map, of } from 'rxjs';
import { FixtureHttpResponse } from 'src/app/models/fixture-http-response.interface';
import { Fixture } from 'src/app/models/fixture.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FixtureService {
  private readonly httpClient = inject(HttpClient);
  protected maxLastGamesToRetrieve: number = 10;

  getLastFixtures(teamId: number, seasonYear: number): Observable<Fixture[]> {
    const storedValue = localStorage.getItem(
      `last_games_${teamId}_${seasonYear}`
    );
    if (
      storedValue !== null &&
      (JSON.parse(storedValue) as Fixture[]).length > 0
    ) {
      return of(JSON.parse(storedValue) as Fixture[]);
    }

    const httpParams = new HttpParams()
      .set('team', teamId)
      .set('season', seasonYear)
      .set('last', this.maxLastGamesToRetrieve);
    return this.httpClient
      .get<FixtureHttpResponse>(`${environment.fixtures}`, {
        headers: new HttpHeaders({
          'x-rapidapi-key': `${environment.apiKey}`,
        }),

        params: httpParams,
      })
      .pipe(
        map((resp: FixtureHttpResponse) => {
          const data = resp['response'];
          let games: Fixture[] = [];
          for (let i = 0; i < data.length; i++) {
            games.push({
              homeLogo: data[i].teams.home.logo,
              homeTeamName: data[i].teams.home.name,
              homeGoals: data[i].goals.home,
              awayLogo: data[i].teams.away.logo,
              awayTeamName: data[i].teams.away.name,
              awayGoals: data[i].goals.away,
            });
          }
          localStorage.setItem(
            `last_games_${teamId}_${seasonYear}`,
            JSON.stringify(games)
          );
          return games;
        }),
        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      );
  }
}
