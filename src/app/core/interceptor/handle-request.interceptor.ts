// import {
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest,
// } from '@angular/common/http';
// import { environment } from 'src/environments/environment.development';

// export class HandleRequestInterceptor implements HttpInterceptor {
//   intercept(request: HttpRequest<any>, next: HttpHandler) {
//     const modifiedRequest = request.clone({
//       setHeaders: {
//         'x-rapidapi-key': `${environment.apiKey}`,
//       },
//     });
//     return next.handle(modifiedRequest);
//   }
// }
