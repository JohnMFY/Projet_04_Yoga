import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { Teacher } from '../models/teacher.interface';

let httpTestingController: HttpTestingController;
describe('TeacherService', () => {
  let service: TeacherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TeacherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Recupèration de tous les teachers', () => {
    const mockTeachers: Teacher[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    service.all().subscribe(response => {
      expect(response).toEqual(mockTeachers);
    });

    const request = httpTestingController.expectOne('api/teacher');

    expect(request.request.method).toBe('GET');

    request.flush(mockTeachers);
  });
  it('Récupère un teacher avec son id', () => {
    const mockTeacher: Teacher = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    service.detail('1').subscribe(response => {
      expect(response).toEqual(mockTeacher);
    });

    const request = httpTestingController.expectOne('api/teacher/1');

    expect(request.request.method).toBe('GET');

    request.flush(mockTeacher);
  });
});