import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthFacadeService } from './auth-facade.service';
import { AuthApiService } from './auth-api.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/user.model';

describe('AuthFacadeService', () => {
  let service: AuthFacadeService;
  let apiMock: {
    login: ReturnType<typeof vi.fn>;
    signup: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };
  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};

    apiMock = {
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => storage[key] ?? null),
        setItem: vi.fn((key: string, value: string) => { storage[key] = value; }),
        removeItem: vi.fn((key: string) => { delete storage[key]; }),
        clear: vi.fn(() => { storage = {}; }),
        length: 0,
        key: vi.fn(),
      },
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [
        AuthFacadeService,
        { provide: AuthApiService, useValue: apiMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(AuthFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have currentUser as null when localStorage is empty', () => {
      expect(service.currentUser()).toBeNull();
    });

    it('should load user from localStorage on init', () => {
      const user = { id: 1, email: 'test@test.com', isAdmin: false };
      storage['spotify_user'] = JSON.stringify(user);

      service = TestBed.inject(AuthFacadeService);

      expect(service.currentUser()).toEqual(user);
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      storage['spotify_user'] = 'invalid-json';

      service = TestBed.inject(AuthFacadeService);

      expect(service.currentUser()).toBeNull();
      expect(localStorage.getItem('spotify_user')).toBeNull();
    });
  });

  describe('login', () => {
    it('should store user in localStorage and update currentUser signal', () => {
      const user = { id: 1, email: 'test@test.com', isAdmin: false };
      const response: AuthResponse = { message: 'ok', user };
      apiMock.login.mockReturnValue(of(response));

      service.login('test@test.com', 'password').subscribe(() => {
        expect(service.currentUser()).toEqual(user);
      });

      expect(apiMock.login).toHaveBeenCalledWith('test@test.com', 'password');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'spotify_user',
        JSON.stringify(user),
      );
    });
  });

  describe('signup', () => {
    it('should delegate to authApi.signup and return the response', () => {
      const response: AuthResponse = {
        message: 'ok',
        user: { id: 2, email: 'new@test.com', isAdmin: false },
      };
      apiMock.signup.mockReturnValue(of(response));

      let result: AuthResponse | undefined;
      service.signup('new@test.com', 'password').subscribe(r => (result = r));

      expect(apiMock.signup).toHaveBeenCalledWith('new@test.com', 'password');
      expect(result).toEqual(response);
    });
  });

  describe('logout', () => {
    it('should remove user, clear signal, and navigate to /login', () => {
      storage['spotify_user'] = JSON.stringify({
        id: 1,
        email: 'test@test.com',
        isAdmin: false,
      });
      service = TestBed.inject(AuthFacadeService);
      expect(service.currentUser()).toBeTruthy();

      apiMock.logout.mockReturnValue(of({}));

      service.logout().subscribe();

      expect(apiMock.logout).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalledWith('spotify_user');
      expect(service.currentUser()).toBeNull();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
