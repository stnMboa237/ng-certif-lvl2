import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { footballRoutes } from './app/app.routes';
// import { HandleRequestInterceptor } from './app/core/interceptor/handle-request.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(footballRoutes),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HandleRequestInterceptor,
    //   multi: true,
    // },
  ],
}).catch((err: Error): void => console.error(err));
