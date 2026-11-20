import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../core/service/session.service';
import { DetailComponent } from './detail.component';
import { jest } from '@jest/globals';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../../../core/models/session.interface';
import { Teacher } from '../../../../core/models/teacher.interface';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { TeacherService } from '../../../../core/service/teacher.service';

const mockSession: Session = {
  id: 1,
  name: 'Yoga session',
  description: 'Test session',
  date: new Date(),
  teacher_id: 2,
  users: [1]
};

const mockTeacher: Teacher = {
  id: 2,
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockSessionApiService = {
  detail: jest.fn().mockReturnValue(of(mockSession)),
  delete: jest.fn().mockReturnValue(of(void 0)),
  participate: jest.fn().mockReturnValue(of(void 0)),
  unParticipate: jest.fn().mockReturnValue(of(void 0))
};

const mockTeacherService = {
  detail: jest.fn().mockReturnValue(of(mockTeacher))
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn().mockReturnValue('1')
    }
  }
};

const mockMatSnackBar = {
  open: jest.fn()
};

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailComponent,
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    })
      .overrideProvider(MatSnackBar, { useValue: mockMatSnackBar })
      .compileComponents();
      service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Doit récupérer la session et le teacher', () => {
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual(mockSession);

    expect(mockTeacherService.detail).toHaveBeenCalledWith('2');
    expect(component.teacher).toEqual(mockTeacher);

    expect(component.isParticipate).toBeTruthy();
  });

  it('Inscription du user à la session', () => {
    component.participate();
    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });

  it('Désinscription du user de la session', () => {
    component.unParticipate();

    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });
  it('Doit supprimer la session et rediriger vers sessions', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.delete();

    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');

    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 }
    );

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });
});

