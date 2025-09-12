import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA7OpAUDfF-Oz40UZvZLjx8gkAB9xQQkWc",
  authDomain: "blog-platform-6f6f6.firebaseapp.com",
  projectId: "blog-platform-6f6f6",
  storageBucket: "blog-platform-6f6f6.appspot.com",
  messagingSenderId: "924217354444",
  appId: "1:924217354444:web:8646b28866230ee9093a69",
  measurementId: "G-1S2VL423SV"
};

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
})
.catch((err) => console.error(err));
