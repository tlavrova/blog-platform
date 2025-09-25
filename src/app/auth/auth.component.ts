import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="auth-wrapper">
    <h2>{{ mode() === 'login' ? 'Login' : 'Create Account' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <div class="form-field">
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" autocomplete="email" />
        <small class="error" *ngIf="submitted() && form.get('email')?.invalid">Valid email required</small>
      </div>

      <div class="form-field" *ngIf="mode() === 'register'">
        <label for="displayName">Display Name</label>
        <input id="displayName" type="text" formControlName="displayName" autocomplete="name" />
        <small class="error" *ngIf="submitted() && form.get('displayName')?.invalid">Display name required</small>
      </div>

      <div class="form-field">
        <label for="password">Password</label>
        <input id="password" [type]="showPassword() ? 'text' : 'password'" formControlName="password" autocomplete="current-password" />
        <button type="button" class="link-btn" (click)="toggleShowPassword()">{{ showPassword() ? 'Hide' : 'Show' }}</button>
        <small class="error" *ngIf="submitted() && form.get('password')?.invalid">Password (min 6 chars) required</small>
      </div>

      <div class="status" *ngIf="error()">{{ error() }}</div>

      <button type="submit" [disabled]="loading()">{{ loading() ? (mode()==='login' ? 'Logging in...' : 'Creating...') : (mode()==='login' ? 'Login' : 'Register') }}</button>
    </form>

    <p class="switch">{{ mode() === 'login' ? "Don't have an account?" : 'Already have an account?' }}
      <a (click)="toggleMode()" role="button">{{ mode() === 'login' ? 'Register' : 'Login' }}</a>
    </p>
  </div>
  `,
  styles: [`
    .auth-wrapper { max-width: 360px; margin: 2rem auto; padding:1.5rem; border:1px solid #ddd; border-radius:8px; background:#fff; }
    h2 { margin-top:0; }
    form { display:flex; flex-direction:column; gap:1rem; }
    .form-field { display:flex; flex-direction:column; position:relative; }
    label { font-weight:600; margin-bottom:0.25rem; }
    input { padding:0.5rem 0.6rem; font-size:1rem; border:1px solid #bbb; border-radius:4px; }
    button[type=submit] { padding:0.6rem 1rem; background:#1976d2; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:1rem; }
    button[disabled] { opacity:0.7; cursor:progress; }
    .switch { font-size:0.9rem; text-align:center; margin-top:1rem; }
    .switch a { cursor:pointer; color:#1976d2; text-decoration:underline; }
    .error { color:#c62828; font-size:0.75rem; margin-top:0.25rem; }
    .status { color:#c62828; font-size:0.85rem; }
    .link-btn { position:absolute; right:0.5rem; top:2rem; background:none; border:none; color:#1976d2; cursor:pointer; font-size:0.75rem; }
  `]
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode = signal<'login' | 'register'>('login');
  submitted = signal(false);
  showPassword = signal(false);

  loading = signal(false);
  error = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    displayName: ['',[/* required only in register mode */]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    const dataMode = this.route.snapshot.data['mode'];
    if (dataMode === 'register') this.mode.set('register');
  }

  toggleShowPassword() { this.showPassword.update(v => !v); }

  toggleMode() {
    this.mode.update(m => m === 'login' ? 'register' : 'login');
    // Adjust validators for displayName depending on mode
    if (this.mode() === 'register') {
      this.form.get('displayName')?.addValidators([Validators.required]);
    } else {
      this.form.get('displayName')?.clearValidators();
      this.form.get('displayName')?.setValue('');
    }
    this.form.get('displayName')?.updateValueAndValidity();
  }

  async onSubmit() {
    this.submitted.set(true);
    this.error.set(null);
    if (this.mode() === 'register') {
      if (this.form.invalid) return;
    } else {
      // displayName not required; remove validator side effects
      if (this.form.invalid) return;
    }

    this.loading.set(true);
    try {
      const email = this.form.value.email as string;
      const password = this.form.value.password as string;
      if (this.mode() === 'login') {
        await this.auth.login(email, password);
      } else {
        const displayName = (this.form.value.displayName as string) || undefined;
        await this.auth.register(email, password, displayName);
      }
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/posts';
      this.router.navigateByUrl(returnUrl);
    } catch (e: any) {
      this.error.set(e.message || 'Authentication failed');
    } finally {
      this.loading.set(false);
    }
  }
}
