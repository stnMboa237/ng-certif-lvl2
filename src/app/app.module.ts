import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HandleRequestInterceptor } from './core/interceptor/handle-request.interceptor';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './layout/home/home.component';
import { StandingDetailsComponent } from './layout/standing-details/standing-details.component';
import { StandingComponent } from './layout/standing/standing.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StandingComponent,
    StandingDetailsComponent,
    HomeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandleRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
