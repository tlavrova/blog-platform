import { Injectable, inject, InjectionToken } from '@angular/core';
import { Auth, User, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from '@angular/fire/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';

export const AUTH_USER_STREAM = new InjectionToken<Observable<User | null>>('AUTH_USER_STREAM');

export interface AuthUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  private injectedUser$ = inject(AUTH_USER_STREAM, { optional: true });

  // Expose raw firebase user stream (can be overridden in tests)
  readonly user$: Observable<User | null> = this.injectedUser$ ?? authState(this.auth);

  // Derived user info (plain object, easier for templates/testing)
  readonly userInfo$: Observable<AuthUserInfo | null> = this.user$.pipe(
    map(u => u ? ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      emailVerified: u.emailVerified
    }) : null)
  );

  // Simple auth status observable
  readonly isAuthenticated$: Observable<boolean> = this.user$.pipe(map(u => !!u));

  // Internal loading state if needed for UI spinners
  private _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  // Last auth error message (user friendly)
  private _error$ = new BehaviorSubject<string | null>(null);
  readonly error$ = this._error$.asObservable();

  private setLoading(val: boolean) { this._loading$.next(val); }
  private setError(msg: string | null) { this._error$.next(msg); }

  async register(email: string, password: string, displayName?: string): Promise<AuthUserInfo> {
    this.setError(null);
    this.setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      if (displayName) {
        try { await updateProfile(cred.user, { displayName }); } catch { /* ignore profile error */ }
      }
      return {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        emailVerified: cred.user.emailVerified
      };
    } catch (err: any) {
      const friendly = this.mapAuthError(err?.code || err?.message || 'auth/unknown');
      this.setError(friendly);
      throw new Error(friendly);
    } finally {
      this.setLoading(false);
    }
  }

  async login(email: string, password: string): Promise<AuthUserInfo> {
    this.setError(null);
    this.setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      return {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        emailVerified: cred.user.emailVerified
      };
    } catch (err: any) {
      const friendly = this.mapAuthError(err?.code || err?.message || 'auth/unknown');
      this.setError(friendly);
      throw new Error(friendly);
    } finally {
      this.setLoading(false);
    }
  }

  async logout(): Promise<void> {
    this.setError(null);
    this.setLoading(true);
    try {
      await signOut(this.auth);
    } catch (err: any) {
      const friendly = this.mapAuthError(err?.code || err?.message || 'auth/unknown');
      this.setError(friendly);
      throw new Error(friendly);
    } finally {
      this.setLoading(false);
    }
  }

  private mapAuthError(code: string): string {
    switch (code) {
      case 'auth/invalid-email': return 'The email address is badly formatted.';
      case 'auth/user-disabled': return 'This user account has been disabled.';
      case 'auth/user-not-found': return 'No user found with these credentials.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/email-already-in-use': return 'This email is already in use.';
      case 'auth/weak-password': return 'Password is too weak (minimum 6 characters).';
      case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
      default: return 'Authentication failed. Please try again.';
    }
  }
}
