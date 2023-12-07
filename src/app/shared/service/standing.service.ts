import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, map, of } from 'rxjs';
import { CountryHttpResponse } from 'src/app/models/country-http-response.interface';
import { CountryLeagueInfo } from 'src/app/models/country-league-info.interface';
import { Country } from 'src/app/models/country.interface';
import { DefaultCountry } from 'src/app/models/default-country.interface';
import { LeagueHttpResponse } from 'src/app/models/league-http-response.interface';
import { LeagueStanding } from 'src/app/models/league-standing.interface';
import { StandingHttpResponse } from 'src/app/models/standing-http-response.interface';
import { TeamStandingInfo } from 'src/app/models/team-standing-info.interface';
import { LeagueIndexResponseBody } from 'src/app/models/test.interfqce';
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
      .get<StandingHttpResponse>(`${environment.standings}`, {
        headers: new HttpHeaders({
          'x-rapidapi-key': `${environment.apiKey}`,
        }),

        params: httpParams,
      })
      .pipe(
        map((resp: StandingHttpResponse) => {
          const data: LeagueStanding[] = resp.response[0].league.standings[0];
          let teamStanding: TeamStandingInfo[] = [];
          for (let i = 0; i < data.length; i++) {
            let teamInfo: LeagueStanding = data[i];
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

  getLeagueId(
    countryName: string,
    leagueDescription?: string
  ): Observable<number> {
    const storedValue = localStorage.getItem(`${countryName}LeagueId`);
    if (storedValue !== null && JSON.parse(storedValue)) {
      const value = JSON.parse(storedValue) as CountryLeagueInfo;
      return of(value.leagueId);
    }

    return this.httpClient
      .get<LeagueHttpResponse>(`${environment.leaguesUrl}`, {
        headers: new HttpHeaders({
          'x-rapidapi-key': `${environment.apiKey}`,
        }),

        params: new HttpParams().append('search', countryName),
      })
      .pipe(
        map((resp: LeagueHttpResponse): number => {
          let valueToStore: CountryLeagueInfo;
          const filteredInfo: LeagueIndexResponseBody | undefined = resp[
            'response'
          ].find(
            (x) =>
              x['league']['name'].toLowerCase() ===
              leagueDescription?.toLowerCase()
          );

          if (filteredInfo) {
            valueToStore = {
              leagueId: filteredInfo['league']['id'],
              country: filteredInfo['country']['name'],
              leagueName: filteredInfo['league']['name'],
            };
          } else {
            valueToStore = {
              leagueId: resp['response'][0]['league']['id'],
              country: resp['response'][0]['country']['name'],
              leagueName: resp['response'][0]['league']['name'],
            };
          }

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

    return this.httpClient
      .get<CountryHttpResponse>(`${environment.countries}`, {
        headers: new HttpHeaders({
          'x-rapidapi-key': `${environment.apiKey}`,
        }),
      })
      .pipe(
        map((resp: CountryHttpResponse): Country[] => {
          let countryList: Array<Country> = [];
          let data = resp.response;
          data.forEach((c) => {
            if (
              environment.defaultCountriesList.find(
                (x: DefaultCountry) => x.name === c.name.toLowerCase()
              )
            ) {
              countryList.push(c);
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
