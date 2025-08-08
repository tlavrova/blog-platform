import { Routes } from '@angular/router';
import { Posts } from './components/posts/posts';

export const routes: Routes = [
  { path: '', component: Posts },
  { path: 'posts', component: Posts }
];
