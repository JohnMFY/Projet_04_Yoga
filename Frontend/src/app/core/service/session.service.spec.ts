import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../models/sessionInformation.interface';

const mockUser: SessionInformation = {
  token: 'fake-token',
  type: 'Bearer',
  id: 1,
  username: 'test@test.com',
  firstName: 'John',
  lastName: 'Doe',
  admin: false
};

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Doit être déconnecté par défaut', () => {
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();
  });

  it('Connection du user', () => {
    service.logIn(mockUser);

    expect(service.isLogged).toBeTruthy();
    expect(service.sessionInformation).toEqual(mockUser);
  });

  it('Déconnexion du user', () => {
    service.logIn(mockUser);

    service.logOut();

    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();
  });

  it('Met à jour l"état de connexion', () => {
    let isLogged = false;

    service.$isLogged().subscribe(value => {
      isLogged = value;
    });

    service.logIn(mockUser);

    expect(isLogged).toBeTruthy();

    service.logOut();

    expect(isLogged).toBeFalsy();
  });

});
