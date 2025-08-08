import { Routes } from '@angular/router';
import { PostList } from './post-list/post-list';
import { Post } from './post/post';
import { PostEditor } from './post-editor/post-editor';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostList },
  { path: 'post/:id', component: Post },
  { path: 'posts/create', component: PostEditor },
  { path: 'posts/edit/:id', component: PostEditor }
];
