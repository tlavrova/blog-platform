import { Routes } from '@angular/router';
import { PostList } from './post-list/post-list';
import { Post } from './post/post';
import { PostEditor } from './post-editor/post-editor';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  { path: 'posts', component: PostList },
  { path: 'post/:id', component: Post },
  { path: 'posts/create', component: PostEditor, canActivate: [authGuard] },
  { path: 'posts/edit/:id', component: PostEditor, canActivate: [authGuard] },
  { path: 'login', component: AuthComponent, data: { mode: 'login' } },
  { path: 'register', component: AuthComponent, data: { mode: 'register' } },
  { path: '**', redirectTo: 'posts' }
];
