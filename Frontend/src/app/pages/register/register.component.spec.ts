import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect, jest } from '@jest/globals';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [
      RegisterComponent,
      BrowserAnimationsModule,
      HttpClientModule,
      ReactiveFormsModule,
      MatCardModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule
    ]
  })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Si les inputs sont vides = false', () => {
  expect(component.form.valid).toBeFalsy();
  });

  it('Si les inputs sont valides = true', () => {
    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '123'
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('Si inscription OK, redirige vers login', () => {
    const authService = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);

    jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '123'
    });

    component.submit();

    expect(authService.register).toHaveBeenCalledWith({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '123'
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('Si inscription KO, erreur', () => {
    const authService = TestBed.inject(AuthService);

    jest.spyOn(authService, 'register').mockReturnValue(
      throwError(() => new Error('Register failed'))
    );

    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '123'
    });

    component.submit();

    expect(component.onError).toBeTruthy();
  });
});
