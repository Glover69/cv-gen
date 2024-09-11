import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AppComponent } from './app/app.component';

declare var html2pdf: any;

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideAuth0({
//       domain: 'dev-fc5lurkbs7t0nlpj.us.auth0.com',
//       clientId: 'VB2JleftQqgfnBjqeMKOHh1fKrtHnIQB',
//       authorizationParams: {
//         redirect_uri: window.location.origin
//       }
//     }),
//   ]
// });

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

// bootstrapApplication(AppComponent, {
//   providers: [
//     // provideAuth0({
//     //   domain: 'dev-fc5lurkbs7t0nlpj.us.auth0.com',
//     //   clientId: 'VB2JleftQqgfnBjqeMKOHh1fKrtHnIQB',
//     //   authorizationParams: {
//     //     // redirect_uri: window.location.origin
//     //   }
//     // }),
//   ]
// });
