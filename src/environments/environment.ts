// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Add your own firebase credentials here
  firebase: {
    apiKey: "AIzaSyAyUU2X2O2ddeoM6YmjS5kco9hcmUw9lXk",
    authDomain: "gb-dev-74bd7.firebaseapp.com",
    databaseURL: "https://gb-dev-74bd7-default-rtdb.firebaseio.com",
    projectId: "gb-dev-74bd7",
    storageBucket: "gb-dev-74bd7.appspot.com",
    messagingSenderId: "38127944473",
    appId: "1:38127944473:web:3e702a1b9c93891f29bb88",
    measurementId: "G-551MX5DQTZ"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
