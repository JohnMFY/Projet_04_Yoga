import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, jest } from '@jest/globals';

import { AuthGuard } from './auth.guard';
import { SessionService } from '../core/service/session.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const mockSessionService = {
    isLogged: false
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('Autorise accès si user connecté', () => {
    mockSessionService.isLogged = true;

    const result = guard.canActivate();

    expect(result).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('Refuse accès et redirige vers login si user non connecté', () => {
    mockSessionService.isLogged = false;

    const result = guard.canActivate();

    expect(result).toBeFalsy();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});