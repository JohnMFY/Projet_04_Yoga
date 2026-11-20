import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SessionService } from 'src/app/core/service/session.service';
import { expect, jest } from '@jest/globals';
import { MeComponent } from './me.component';
import { of } from 'rxjs';
import { User } from 'src/app/core/models/user.interface';
import { UserService } from 'src/app/core/service/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: false,
      id: 1
    },
    logOut: jest.fn()
  };

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
    password: '123',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn().mockReturnValue(of(void 0))
  };

  const mockMatSnackBar = {
  open: jest.fn()
  };

  beforeEach(async () => {
   await TestBed.configureTestingModule({
    imports: [
      MeComponent,
      HttpClientModule,
      MatCardModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule
    ],
    providers: [
      { provide: SessionService, useValue: mockSessionService },
      { provide: UserService, useValue: mockUserService }
    ],
  })
    .overrideProvider(MatSnackBar, { useValue: mockMatSnackBar })
    .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Doit récupérer les datas du user', () => {
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

 it('Doit supprimer le compte du user et le rediriger vers login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.delete();

    expect(mockUserService.delete).toHaveBeenCalledWith('1');

    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );

    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

});
