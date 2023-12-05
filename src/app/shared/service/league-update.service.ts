import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Country } from 'src/app/models/country.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LeagueUpdateService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  getLeagueStanding(leagueName: string, leagueId: number, year: number) {
    /*
      TO DO
      store the league data into the local storage if it already exists for the current year
    */
    const httpParams = new HttpParams()
      .set('league', `${leagueId}`)
      .set('season', `${year}`);
    return this.httpClient.get(`${environment.standings}`, {
      params: httpParams,
    });
  }

  getCurrentSeasonYear(): Observable<number> {
    const today = new Date();
    const result =
      today.getMonth() + 1 > 7 ? today.getFullYear() : today.getFullYear() - 1;
    return of(result);
  }

  getLeagueId(leagueName: string): Observable<any> {
    return this.httpClient.get(`${environment.leaguesUrl}`, {
      params: new HttpParams().append('search', leagueName),
    });
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
