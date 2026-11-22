import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { AuthService } from './auth.service';
import { LoginRequest } from '../models/loginRequest.interface';
import { RegisterRequest } from '../models/registerRequest.interface';
import { SessionInformation } from '../models/sessionInformation.interface';

describe('AuthService', () => {
    let service: AuthService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [
            AuthService,
            provideHttpClient(),
            provideHttpClientTesting()
        ]
        });

        service = TestBed.inject(AuthService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Envoye une requête POST pour connecter un user', () => {
        const loginRequest: LoginRequest = {
            email: 'test@test.com',
            password: '123'
        };

        const mockResponse: SessionInformation = {
            token: 'fake-token',
            type: 'Bearer',
            id: 1,
            username: 'test@test.com',
            firstName: 'John',
            lastName: 'Doe',
            admin: false
        };

        service.login(loginRequest).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const request = httpTestingController.expectOne('/api/auth/login');

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(loginRequest);

        request.flush(mockResponse);
    });

    it('Envoye une requête POST pour inscrire un user', () => {
        const registerRequest: RegisterRequest = {
            email: 'test@test.com',
            firstName: 'John',
            lastName: 'Doe',
            password: '123'
        };

        service.register(registerRequest).subscribe(response => {
            expect(response).toBeUndefined();
        });

        const request = httpTestingController.expectOne('/api/auth/register');

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(registerRequest);

        request.flush(null);
    });
});