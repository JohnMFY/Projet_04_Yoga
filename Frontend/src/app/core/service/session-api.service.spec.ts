import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';

import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { Session } from '../models/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SessionApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Récupére les sessions', () => {
    const mockSessions: Session[] = [
      {
        id: 1,
        name: 'Yoga',
        description: 'Session test',
        date: new Date(),
        teacher_id: 1,
        users: []
      }
    ];

    service.all().subscribe(response => {
      expect(response).toEqual(mockSessions);
    });

    const request = httpTestingController.expectOne('api/session');

    expect(request.request.method).toBe('GET');

    request.flush(mockSessions);
  });

  it('Récupére une session avec son id', () => {
    const mockSession: Session = {
      id: 1,
      name: 'Yoga',
      description: 'Session test',
      date: new Date(),
      teacher_id: 1,
      users: []
    };

    service.detail('1').subscribe(response => {
      expect(response).toEqual(mockSession);
    });

    const request = httpTestingController.expectOne('api/session/1');

    expect(request.request.method).toBe('GET');

    request.flush(mockSession);
  });

  it('Création de session', () => {
    const mockSession: Session = {
      name: 'Yoga',
      description: 'Session test',
      date: new Date(),
      teacher_id: 1,
      users: []
    };

    service.create(mockSession).subscribe(response => {
      expect(response).toEqual(mockSession);
    });

    const request = httpTestingController.expectOne('api/session');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(mockSession);

    request.flush(mockSession);
  });

  it('Modification de session', () => {
    const mockSession: Session = {
      id: 1,
      name: 'Yoga modifié',
      description: 'Session modifiée',
      date: new Date(),
      teacher_id: 1,
      users: []
    };

    service.update('1', mockSession).subscribe(response => {
      expect(response).toEqual(mockSession);
    });

    const request = httpTestingController.expectOne('api/session/1');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(mockSession);

    request.flush(mockSession);
  });

  it('Suppression de session', () => {
    service.delete('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const request = httpTestingController.expectOne('api/session/1');

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

  it('Inscription de user à une session', () => {
    service.participate('1', '2').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const request = httpTestingController.expectOne(
      'api/session/1/participate/2'
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBeNull();

    request.flush(null);
  });

  it('Désinscription de user d"une session', () => {
    service.unParticipate('1', '2').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const request = httpTestingController.expectOne(
      'api/session/1/participate/2'
    );

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });
});
