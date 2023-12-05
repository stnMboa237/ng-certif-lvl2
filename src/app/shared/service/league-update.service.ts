import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Country } from 'src/app/models/country.interface';
import { League } from 'src/app/models/league.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LeagueUpdateService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  protected countryLeaguesIds: Array<{
    countryName: string;
    leagueId: number;
  }> = [];

  getLeagueStanding(
    leagueId: number,
    year: number
  ): Observable<TeamStandingInfo[]> {
    /*
      TO DO
      store the league data into the local storage if it already exists for the current year
    */
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
              games: 0,
              goalDifference: 0,
              logo: '',
              loose: 0,
              points: 0,
              rank: 0,
              teamName: '',
              win: 0,
            };
            teamStanding.push(t);
          }
          return teamStanding;
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
      const value = JSON.parse(storedValue) as CountryLeagueId;
      return of(value.leagueId);
    }

    return this.httpClient
      .get(`${environment.leaguesUrl}`, {
        params: new HttpParams().append('search', countryName),
      })
      .pipe(
        map((resp: any) => {
          let valueToStore: CountryLeagueId = {
            leagueId: resp['response'][0]['league']['id'],
            country: resp['response'][0]['country']['name'],
            leagueName: resp['response'][0]['league']['name'],
          };
          localStorage.setItem(
            `${countryName}LeagueId`,
            JSON.stringify(valueToStore)
          );
          return valueToStore.leagueId; //resp['response'][0]['league']['id'];
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
    return (
      this.httpClient
        .get(`${environment.countries}`)
        // TO DO: REMOVE type 'any' !!! and use rxjs to filter countries
        .pipe(
          map((resp: any) => {
            let countryList: Array<Country> = [];
            const data = resp['response'];
            data.forEach((c: Country) => {
              if (countryCheckList.includes(c.name.toLowerCase())) {
                countryList.push(c);
              }
            });
            localStorage.setItem('countries', JSON.stringify(countryList));
            return countryList;
          })
        )
    );
  }
}

interface Response {
  response: {
    league: League;
  };
}

interface CountryLeagueId {
  country: string;
  leagueId: number;
  leagueName: string;
}

interface TeamStandingInfo {
  rank: number;
  logo: string;
  teamName: string;
  games: number;
  win: number;
  loose: number;
  draw: number;
  goalDifference: number;
  points: number;
}
