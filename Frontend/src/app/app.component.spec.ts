import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { jest } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from './core/service/session.service';

const mockSessionService = {
  $isLogged: jest.fn().mockReturnValue(of(true)),
  logOut: jest.fn()
};

describe('AppComponent', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('Retourne état de connexion', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    let isLogged = false;

    app.$isLogged().subscribe(value => {
      isLogged = value;
    });

    expect(mockSessionService.$isLogged).toHaveBeenCalled();
    expect(isLogged).toBeTruthy();
  });
  
  it('Deconnexion et redirirection vers login', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);

    const navigateSpy = jest.spyOn(router, 'navigate');

    app.logout();

    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
