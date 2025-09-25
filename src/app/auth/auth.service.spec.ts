import { TestBed } from '@angular/core/testing';
import { AuthService, AuthUserInfo } from './auth.service';
import { Auth, User } from '@angular/fire/auth';
import * as afAuth from '@angular/fire/auth';
import { of, firstValueFrom } from 'rxjs';

// Minimal mock Firebase User
const mockUser: Partial<User> = {
  uid: '123',
  email: 'test@example.com',
  displayName: 'Tester',
  emailVerified: true
};

// Utility to create a fake user credential
function createUserCredential(user: Partial<User>): any {
  return { user };
}

describe('AuthService', () => {
  let service: AuthService;

  // Spies for Firebase auth functions used
  let authStateSpy: jasmine.Spy;
  let signInSpy: jasmine.Spy;
  let createUserSpy: jasmine.Spy;
  let signOutSpy: jasmine.Spy;

  const mockAuth: Partial<Auth> = {};

  beforeEach(() => {
    // Arrange spies BEFORE service instantiation (since observables are created eagerly)
    authStateSpy = spyOn(afAuth, 'authState').and.returnValue(of(mockUser as User));
    signInSpy = spyOn(afAuth, 'signInWithEmailAndPassword').and.callFake((_auth, email: string, _pw: string) => {
      return Promise.resolve(createUserCredential({ ...mockUser, email }));
    });
    createUserSpy = spyOn(afAuth, 'createUserWithEmailAndPassword').and.callFake((_auth, email: string, _pw: string) => {
      return Promise.resolve(createUserCredential({ ...mockUser, email }));
    });
    signOutSpy = spyOn(afAuth, 'signOut').and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: mockAuth }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(authStateSpy).toHaveBeenCalled();
  });

  it('should expose derived userInfo$', async () => {
    const info = await firstValueFrom(service.userInfo$);
    const expected: AuthUserInfo = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Tester',
      emailVerified: true
    };
    expect(info).toEqual(expected);
  });

  it('isAuthenticated$ should emit true when user exists', async () => {
    const val = await firstValueFrom(service.isAuthenticated$);
    expect(val).toBeTrue();
  });

  it('login() should resolve with user info and toggle loading state', async () => {
    const loadingValues: boolean[] = [];
    const sub = service.loading$.subscribe(v => loadingValues.push(v));
    const result = await service.login('new@example.com', 'password123');
    expect(signInSpy).toHaveBeenCalled();
    expect(result.email).toBe('new@example.com');
    // Expect loading sequence: initial false (BehaviorSubject), true, false
    expect(loadingValues).toEqual([false, true, false]);
    sub.unsubscribe();
  });

  it('login() should map auth error codes to friendly messages', async () => {
    signInSpy.and.callFake(() => Promise.reject({ code: 'auth/wrong-password' }));
    try {
      await service.login('test@example.com', 'bad');
      fail('Expected login to throw');
    } catch (e: any) {
      expect(e.message).toContain('Incorrect password');
    }
  });

  it('logout() should call signOut', async () => {
    await service.logout();
    expect(signOutSpy).toHaveBeenCalled();
  });
});

