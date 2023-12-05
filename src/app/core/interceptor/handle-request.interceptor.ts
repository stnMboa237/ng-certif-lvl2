import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

export class HandleRequestInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const modifiedRequest = request.clone({
      setHeaders: {
        // 'x-rapidapi-host': 'v3.football.api-sports.io',
        // 'x-rapidapi-key': '0552476a4b7df83849c2620dc883dfd3',
        'x-rapidapi-key': '86202ba88122951a7c5e81d1ee8b83dc',
      },
    });
    return next.handle(modifiedRequest);
  }
}
