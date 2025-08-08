import { Routes } from '@angular/router';
import { Posts } from './components/posts/posts';
import { PostEditor } from './post-editor/post-editor';

export const routes: Routes = [
  { path: '', component: Posts },
  { path: 'posts', component: Posts },
  { path: 'posts/create', component: PostEditor },
  { path: 'posts/edit/:id', component: PostEditor }
];
