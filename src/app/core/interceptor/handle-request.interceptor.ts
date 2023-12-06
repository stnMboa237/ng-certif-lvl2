import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

export class HandleRequestInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const modifiedRequest = request.clone({
      setHeaders: {
        'x-rapidapi-key': '86202ba88122951a7c5e81d1ee8b83dc',
      },
    });
    return next.handle(modifiedRequest);
  }
}
