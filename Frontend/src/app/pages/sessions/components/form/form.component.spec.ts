import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest  } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherService } from '../../../../core/service/teacher.service';
import { FormComponent } from './form.component';
import { Session } from 'src/app/core/models/session.interface';

const mockSessionService = {
  sessionInformation: {
    admin: true,
    id: 1
  }
};

const mockSessionApiService = {
  detail: jest.fn(),
  create: jest.fn().mockReturnValue(of({})),
  update: jest.fn().mockReturnValue(of({}))
};

const mockTeacherService = {
  all: jest.fn().mockReturnValue(of([]))
};

const mockMatSnackBar = {
  open: jest.fn()
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn().mockReturnValue('1')
    }
  }
};

const mockSession: Session = {
  id: 1,
  name: 'Yoga soir',
  description: 'Session existante',
  date: new Date('2026-11-25'),
  teacher_id: 2,
  users: []
};

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [
        FormComponent,
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
      .overrideProvider(MatSnackBar, { useValue: mockMatSnackBar })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Initialisation d"un formulaire invalide', () => {
    expect(component.onUpdate).toBeFalsy();
    expect(component.sessionForm).toBeDefined();
    expect(component.sessionForm?.valid).toBeFalsy();
  });

  it('Création d"une session et redirection vers la page des sessions', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.sessionForm?.setValue({
      name: 'test session',
      date: '2026-11-20',
      teacher_id: 1,
      description: 'lorem ipsum dolor sit amet'
    });

    component.submit();

    expect(mockSessionApiService.create).toHaveBeenCalledWith({
      name: 'test session',
      date: '2026-11-20',
      teacher_id: 1,
      description: 'lorem ipsum dolor sit amet'
    });

    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session created !',
      'Close',
      { duration: 3000 }
    );

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });
  it('Modification d"une session', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    jest
      .spyOn(router, 'url', 'get')
      .mockReturnValue('/sessions/update/1');

    mockSessionApiService.detail.mockReturnValue(of(mockSession));

    component.ngOnInit();

    expect(component.onUpdate).toBeTruthy();
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');

    expect(component.sessionForm?.value).toEqual({
      name: 'Yoga soir',
      date: '2026-11-25',
      teacher_id: 2,
      description: 'Session existante'
    });

    component.sessionForm?.setValue({
      name: 'Yoga soir modifié',
      date: '2026-11-26',
      teacher_id: 2,
      description: 'Session modifiée'
    });

    component.submit();

    expect(mockSessionApiService.update).toHaveBeenCalledWith(
      '1',
      {
        name: 'Yoga soir modifié',
        date: '2026-11-26',
        teacher_id: 2,
        description: 'Session modifiée'
      }
    );

    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session updated !',
      'Close',
      { duration: 3000 }
    );

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('Redirige un user non admin vers la page des sessions', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    mockSessionService.sessionInformation.admin = false;

    component.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);

    mockSessionService.sessionInformation.admin = true;
  });

});
