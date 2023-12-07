import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Country } from 'src/app/models/country.interface';
import { StandingService } from 'src/app/shared/service/standing.service';

@Component({
  standalone: true,
  imports: [NgIf, AsyncPipe, NgFor, RouterModule],
  selector: 'ng-header',
  template: `
    <div class="container">
      <div class="masthead">
        <h3 class="text-muted">FOOTBALL UPDATES</h3>
        <ng-container *ngIf="countries$ | async as countries">
          <nav class="header-container">
            <ul class="nav nav-justified">
              <li *ngFor="let country of countries">
                <a
                  class="header-link"
                  [routerLink]="['/standing', country.name]"
                  routerLinkActive="active"
                  >{{ country.name }}</a
                >
              </li>
            </ul>
          </nav>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private readonly standingService = inject(StandingService);
  private readonly router = inject(Router);
  protected countries$: Observable<Array<Country>> = EMPTY;

  ngOnInit(): void {
    this.countries$ = this.standingService.getCountries();
  }
}
