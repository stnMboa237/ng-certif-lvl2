import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, map, of } from 'rxjs';
import { CountryHttpResponse } from 'src/app/models/country-http-response.interface';
import { CountryLeagueInfo } from 'src/app/models/country-league-info.interface';
import { Country } from 'src/app/models/country.interface';
import { LeagueHttpResponse } from 'src/app/models/league-http-response.interface';
import { TeamStandingInfo } from 'src/app/models/team-standing-info.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StandingService {
  private readonly httpClient = inject(HttpClient);
  previousUrl$ = new BehaviorSubject<string>('');

  getLeagueStanding(
    leagueId: number,
    year: number
  ): Observable<TeamStandingInfo[]> {
    const storedValue = localStorage.getItem(`standing_${leagueId}_${year}`);
    if (
      storedValue !== null &&
      (JSON.parse(storedValue) as TeamStandingInfo[]).length > 0
    ) {
      return of(JSON.parse(storedValue) as TeamStandingInfo[]);
    }

    const httpParams = new HttpParams()
      .set('league', `${leagueId}`)
      .set('season', `${year}`);
    return this.httpClient
      .get(`${environment.standings}`, {
        params: httpParams,
      })
      .pipe(
        map((resp: any) => {
          let data: any[] = resp['response'][0]['league']['standings'][0];
          let teamStanding: TeamStandingInfo[] = [];
          for (let i = 0; i < data.length; i++) {
            let teamInfo: any = data[i];
            let t: TeamStandingInfo = {
              draw: teamInfo['all']['draw'],
              games: teamInfo['all']['played'],
              goalDifference: teamInfo['goalsDiff'],
              logo: teamInfo['team']['logo'],
              lose: teamInfo['all']['lose'],
              points: teamInfo['points'],
              rank: teamInfo['rank'],
              teamName: teamInfo['team']['name'],
              win: teamInfo['all']['win'],
              teamId: teamInfo['team']['id'],
            };
            teamStanding.push(t);
          }
          localStorage.setItem(
            `standing_${leagueId}_${year}`,
            JSON.stringify(teamStanding)
          );
          return teamStanding;
        }),
        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      );
  }

  getCurrentSeasonYear(): Observable<number> {
    const today = new Date();
    const result =
      today.getMonth() + 1 > 7 ? today.getFullYear() : today.getFullYear() - 1;
    return of(result);
  }

  getLeagueId(countryName: string): Observable<number> {
    const storedValue = localStorage.getItem(`${countryName}LeagueId`);
    if (storedValue !== null && JSON.parse(storedValue)) {
      const value = JSON.parse(storedValue) as CountryLeagueInfo;
      return of(value.leagueId);
    }

    return this.httpClient
      .get<LeagueHttpResponse>(`${environment.leaguesUrl}`, {
        params: new HttpParams().append('search', countryName),
      })
      .pipe(
        // map((resp: any) => resp['response']),
        // filter((leagues: any) => leagues.find((x: any) => x['league']['name']==='Premier League')),
        map((resp: LeagueHttpResponse): number => {
          const data = resp['response'];
          let valueToStore: CountryLeagueInfo = {
            leagueId: resp['response'][0]['league']['id'],
            country: resp['response'][0]['country']['name'],
            leagueName: resp['response'][0]['league']['name'],
          };
          localStorage.setItem(
            `${countryName}LeagueId`,
            JSON.stringify(valueToStore)
          );
          return valueToStore.leagueId;
        }),
        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      );
  }

  getCountries(): Observable<Array<Country>> {
    const storedValue = localStorage.getItem('countries');
    if (
      storedValue !== null &&
      (JSON.parse(storedValue) as Country[]).length > 0
    ) {
      return of(JSON.parse(storedValue) as Country[]);
    }
    const countryCheckList: Array<string> = [
      'england',
      'spain',
      'germany',
      'france',
      'italy',
    ];
    return this.httpClient
      .get<CountryHttpResponse>(`${environment.countries}`)
      .pipe(
        map((resp: CountryHttpResponse): Country[] => {
          let countryList: Array<Country> = [];
          let data = resp.response;
          data.forEach((c: { country: Country }) => {
            if (countryCheckList.includes(c.country.name.toLowerCase())) {
              countryList.push(c.country);
            }
          });
          localStorage.setItem('countries', JSON.stringify(countryList));
          return countryList;
        }),
        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      );
  }
}
