import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Country } from 'src/app/models/country.interface';
import { StandingService } from 'src/app/shared/service/standing.service';

@Component({
  selector: 'ng-header',
  template: `
    <div class="container">
      <div class="masthead">
        <h3 class="text-muted">FOOTBALL UPDATES</h3>
        <ng-container *ngIf="countries$ | async as countries">
          <nav class="header-container">
            <ul class="nav nav-justified">
              <li *ngFor="let country of countries">
                <!-- <button
                  class="btn bnt-default"
                  type="button"
                  (click)="onSelectCountry(country.name)"
                >
                  {{ country.name }}
                </button> -->
                <a
                  class="header-link"
                  routerLinkActive="active"
                  (click)="onSelectCountry(country.name)"
                  >{{ country.name }}</a
                >
              </li>
              <!-- <li
              [routerLinkActive]="'active'"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              <a id="spainSelect" [routerLink]="['/standing', 'spain']"
                >Spain</a
              >
            </li>-->
            </ul>
          </nav>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private readonly StandingService = inject(StandingService);
  private readonly router = inject(Router);
  protected countries$: Observable<Array<Country>> = EMPTY;

  ngOnInit(): void {
    this.countries$ = this.StandingService.getCountries();
  }

  onSelectCountry(name: string) {
    this.router.navigate(['/standing', name]);
  }
}
