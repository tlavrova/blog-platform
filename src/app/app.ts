import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';
import { AuthUserInfo } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Blog Platform');
  user$: Observable<AuthUserInfo | null>;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.userInfo$;
  }

  logout() {
    this.auth.logout().catch(err => console.error('Logout failed', err));
  }
}
