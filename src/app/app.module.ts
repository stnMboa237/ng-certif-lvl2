import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HandleRequestInterceptor } from './core/interceptor/handle-request.interceptor';

@NgModule({
  declarations: [],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandleRequestInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
