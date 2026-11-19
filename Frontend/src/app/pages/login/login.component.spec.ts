import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    providers: [SessionService],
    imports: [
      LoginComponent,
      RouterTestingModule,
      BrowserAnimationsModule,
      HttpClientModule,
      MatCardModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule
    ]
  })
    .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Si input est vide = false', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('Si les inputs sont valides = true', () => {
    component.form.setValue({
      email: 'test@test.com',
      password: '123'
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('Si la connexion réussit, connecte l’utilisateur et redirige vers la page sessions', () => {
    const authService = TestBed.inject(AuthService);
    const sessionService = TestBed.inject(SessionService);
    const router = TestBed.inject(Router);

    const sessionInformation: SessionInformation = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    };

    jest.spyOn(authService, 'login').mockReturnValue(of(sessionInformation));
    const logInSpy = jest.spyOn(sessionService, 'logIn');
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.form.setValue({
      email: 'test@test.com',
      password: '123'
    });

    component.submit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123'
    });

    expect(logInSpy).toHaveBeenCalledWith(sessionInformation);
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });
  
  it('Si la connexion échoue, affiche une erreur', () => {
    const authService = TestBed.inject(AuthService);

    jest.spyOn(authService, 'login').mockReturnValue(
      throwError(() => new Error('Login failed'))
    );

    component.form.setValue({
      email: 'test@test.com',
      password: '123'
    });

    component.submit();

    expect(component.onError).toBeTruthy();
  });
});
