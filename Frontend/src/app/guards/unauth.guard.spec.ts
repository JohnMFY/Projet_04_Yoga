import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, jest } from '@jest/globals';

import { UnauthGuard } from './unauth.guard';
import { SessionService } from '../core/service/session.service';

describe('UnauthGuard', () => {
  let guard: UnauthGuard;

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
        UnauthGuard,
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(UnauthGuard);
  });

  it('Autorise accès si user non connecté', () => {
    mockSessionService.isLogged = false;

    const result = guard.canActivate();

    expect(result).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('Refuse accès et redirige vers sessions si user connecté', () => {
    mockSessionService.isLogged = true;

    const result = guard.canActivate();

    expect(result).toBeFalsy();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });
});