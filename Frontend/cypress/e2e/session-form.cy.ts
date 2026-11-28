/// <reference types="cypress" />

describe('Session form', () => {
    it('Création d"une session par un admin', () => {
        cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
            token: 'fake-token',
            type: 'Bearer',
            id: 1,
            username: 'yoga@studio.com',
            firstName: 'Admin',
            lastName: 'Admin',
            admin: true
        }
        }).as('login');

        cy.intercept('GET', '/api/session', {
        statusCode: 200,
        body: []
        }).as('sessions');

        cy.intercept('GET', '/api/teacher', {
        statusCode: 200,
        body: [
            {
            id: 1,
            firstName: 'Margot',
            lastName: 'Delahaye'
            }
        ]
        }).as('teachers');

        cy.intercept('POST', '/api/session', {
        statusCode: 200,
        body: {
            id: 1,
            name: 'Session test',
            date: '2026-12-10T00:00:00.000Z',
            teacher_id: 1,
            description: 'Description de la session',
            users: []
        }
        }).as('createSession');

        cy.visit('/login');

        cy.get('input[formControlName=email]')
        .type('yoga@studio.com');

        cy.get('input[formControlName=password]')
        .type('test!1234');

        cy.get('button[type=submit]')
        .click();

        cy.wait('@sessions');

        cy.contains('button', 'Create')
        .click();

        cy.wait('@teachers');

        cy.url()
        .should('include', '/sessions/create');

        cy.get('input[formControlName=name]')
        .type('Session test');

        cy.get('input[formControlName=date]')
        .type('2026-12-10');

        cy.get('mat-select[formControlName=teacher_id]')
        .click();

        cy.contains('mat-option', 'Margot Delahaye')
        .click();

        cy.get('textarea[formControlName=description]')
        .type('Description de la session');

        cy.contains('button', 'Save')
        .click();

        cy.wait('@createSession')
        .its('request.body')
        .should('deep.equal', {
            name: 'Session test',
            date: '2026-12-10',
            teacher_id: 1,
            description: 'Description de la session'
        });

        cy.url()
        .should('include', '/sessions');
    });

    it('Création session KO si le form invalide', () => {
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200,
            body: {
            token: 'fake-token',
            type: 'Bearer',
            id: 1,
            username: 'yoga@studio.com',
            firstName: 'Admin',
            lastName: 'Admin',
            admin: true
            }
        }).as('login');

        cy.intercept('GET', '/api/session', {
            statusCode: 200,
            body: []
        }).as('sessions');

        cy.intercept('GET', '/api/teacher', {
            statusCode: 200,
            body: [
            {
                id: 1,
                firstName: 'Margot',
                lastName: 'Delahaye'
            }
            ]
        }).as('teachers');

        cy.visit('/login');

        cy.get('input[formControlName=email]')
            .type('yoga@studio.com');

        cy.get('input[formControlName=password]')
            .type('test!1234');

        cy.get('button[type=submit]')
            .click();

        cy.wait('@sessions');

        cy.contains('button', 'Create')
            .click();

        cy.wait('@teachers');

        cy.url()
            .should('include', '/sessions/create');

        cy.get('input[formControlName=name]')
            .should('have.value', '');

        cy.get('input[formControlName=date]')
            .should('have.value', '');

        cy.get('mat-select[formControlName=teacher_id]')
            .should('have.attr', 'aria-disabled', 'false');

        cy.get('textarea[formControlName=description]')
            .should('have.value', '');

        cy.contains('button', 'Save')
            .should('be.disabled');
    });

    it('Un admin peut modifier une session', () => {
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200,
            body: {
            token: 'fake-token',
            type: 'Bearer',
            id: 1,
            username: 'yoga@studio.com',
            firstName: 'Admin',
            lastName: 'Admin',
            admin: true
            }
        }).as('login');

        cy.intercept('GET', '/api/session', {
            statusCode: 200,
            body: [
            {
                id: 1,
                name: 'Session 1',
                date: '2026-12-10T00:00:00.000Z',
                teacher_id: 1,
                description: 'Ancienne description',
                users: []
            }
            ]
        }).as('sessions');

        cy.intercept('GET', '/api/session/1', {
            statusCode: 200,
            body: {
            id: 1,
            name: 'Session 1',
            date: '2026-12-10T00:00:00.000Z',
            teacher_id: 1,
            description: 'Ancienne description',
            users: []
            }
        }).as('sessionDetail');

        cy.intercept('GET', '/api/teacher', {
            statusCode: 200,
            body: [
            {
                id: 1,
                firstName: 'Margot',
                lastName: 'Delahaye'
            }
            ]
        }).as('teachers');

        cy.intercept('PUT', '/api/session/1', {
            statusCode: 200,
            body: {
            id: 1,
            name: 'Session modifiée',
            date: '2026-12-15T00:00:00.000Z',
            teacher_id: 1,
            description: 'Nouvelle description',
            users: []
            }
        }).as('updateSession');

        cy.visit('/login');

        cy.get('input[formControlName=email]').type('yoga@studio.com');
        cy.get('input[formControlName=password]').type('test!1234');
        cy.get('button[type=submit]').click();

        cy.wait('@sessions');

        cy.contains('button', 'Edit')
            .click();

        cy.wait('@sessionDetail');
        cy.wait('@teachers');

        cy.url()
            .should('include', '/sessions/update/1');

        cy.get('input[formControlName=name]')
            .clear()
            .type('Session modifiée');

        cy.get('input[formControlName=date]')
            .clear()
            .type('2026-12-15');

        cy.get('textarea[formControlName=description]')
            .clear()
            .type('Nouvelle description');

        cy.contains('button', 'Save')
            .click();

        cy.wait('@updateSession')
            .its('request.body')
            .should('deep.equal', {
            name: 'Session modifiée',
            date: '2026-12-15',
            teacher_id: 1,
            description: 'Nouvelle description'
            });

        cy.url()
            .should('include', '/sessions');
    });

    it('Un admin peut supprimer une session', () => {
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200,
            body: {
            token: 'fake-token',
            type: 'Bearer',
            id: 1,
            username: 'yoga@studio.com',
            firstName: 'Admin',
            lastName: 'Admin',
            admin: true
            }
        }).as('login');

        cy.intercept('GET', '/api/session', {
            statusCode: 200,
            body: [
            {
                id: 1,
                name: 'Session 1',
                date: '2026-12-10T00:00:00.000Z',
                teacher_id: 1,
                description: 'description session 1',
                users: []
            }
            ]
        }).as('sessions');

        cy.intercept('GET', '/api/session/1', {
            statusCode: 200,
            body: {
            id: 1,
            name: 'Session 1',
            date: '2026-12-10T00:00:00.000Z',
            teacher_id: 1,
            description: 'description session 1',
            users: [],
            createdAt: '2026-11-01T10:00:00.000Z',
            updatedAt: '2026-11-15T10:00:00.000Z'
            }
        }).as('sessionDetail');

        cy.intercept('GET', '/api/teacher/1', {
            statusCode: 200,
            body: {
            id: 1,
            firstName: 'Margot',
            lastName: 'Delahaye'
            }
        }).as('teacher');

        cy.intercept('DELETE', '/api/session/1', {
            statusCode: 200,
            body: {}
        }).as('deleteSession');

        cy.visit('/login');

        cy.get('input[formControlName=email]')
            .type('yoga@studio.com');

        cy.get('input[formControlName=password]')
            .type('test!1234');

        cy.get('button[type=submit]')
            .click();

        cy.wait('@sessions');

        cy.contains('button', 'Detail')
            .click();

        cy.wait('@sessionDetail');
        cy.wait('@teacher');

        cy.contains('button', 'Delete')
            .should('be.visible')
            .click();

        cy.wait('@deleteSession');

        cy.contains('Session deleted !')
            .should('be.visible');

        cy.url()
            .should('include', '/sessions');
    });
});