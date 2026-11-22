import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { User } from '../models/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Doit récupérer un user par son id', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@test.com',
      lastName: 'Doe',
      firstName: 'John',
      admin: false,
      password: '123',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    service.getById('1').subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    const request = httpTestingController.expectOne('api/user/1');

    expect(request.request.method).toBe('GET');

    request.flush(mockUser);
  });

  it('Doit supprimer un user par son id', () => {
    service.delete('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const request = httpTestingController.expectOne('api/user/1');

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

});
