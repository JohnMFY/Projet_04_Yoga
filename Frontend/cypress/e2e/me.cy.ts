/// <reference types="cypress" />

describe('Account', () => {
    it('Affiche les infos du user', () => {
        cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
            token: 'fake-token',
            type: 'Bearer',
            id: 2,
            username: 'user@test.com',
            firstName: 'John',
            lastName: 'Doe',
            admin: false
        }
        }).as('login');

        cy.intercept('GET', '/api/session', {
        statusCode: 200,
        body: []
        }).as('sessions');

        cy.intercept('GET', '/api/user/2', {
        statusCode: 200,
        body: {
            id: 2,
            email: 'user@test.com',
            firstName: 'John',
            lastName: 'Doe',
            admin: false,
            createdAt: '2026-11-01T10:00:00.000Z',
            updatedAt: '2026-11-15T10:00:00.000Z'
        }
        }).as('user');

        cy.visit('/login');

        cy.get('input[formControlName=email]')
        .type('user@test.com');

        cy.get('input[formControlName=password]')
        .type('password123');

        cy.get('button[type=submit]')
        .click();

        cy.wait('@sessions');

        cy.contains('Account')
        .click();

        cy.wait('@user');

        cy.url()
        .should('include', '/me');

        cy.contains('User information')
        .should('be.visible');

        cy.contains('Name: John DOE')
        .should('be.visible');

        cy.contains('Email: user@test.com')
        .should('be.visible');

        cy.contains('Delete my account:')
        .should('be.visible');

        cy.contains('button', 'Delete')
        .should('be.visible');
    });

    it('Suppression de son compte', () => {
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200,
            body: {
            token: 'fake-token',
            type: 'Bearer',
            id: 2,
            username: 'user@test.com',
            firstName: 'John',
            lastName: 'Doe',
            admin: false
            }
        }).as('login');

        cy.intercept('GET', '/api/session', {
            statusCode: 200,
            body: []
        }).as('sessions');

        cy.intercept('GET', '/api/user/2', {
            statusCode: 200,
            body: {
            id: 2,
            email: 'user@test.com',
            firstName: 'John',
            lastName: 'Doe',
            admin: false,
            createdAt: '2026-11-01T10:00:00.000Z',
            updatedAt: '2026-11-15T10:00:00.000Z'
            }
        }).as('user');

        cy.intercept('DELETE', '/api/user/2', {
            statusCode: 200,
            body: {}
        }).as('deleteUser');

        cy.visit('/login');

        cy.get('input[formControlName=email]')
            .type('user@test.com');

        cy.get('input[formControlName=password]')
            .type('password123');

        cy.get('button[type=submit]')
            .click();

        cy.wait('@sessions');

        cy.contains('Account')
            .click();

        cy.wait('@user');

        cy.contains('button', 'Delete')
            .click();

        cy.wait('@deleteUser');

        cy.contains('Your account has been deleted !')
            .should('be.visible');

        cy.url()
            .should('include', '/login');
    });

    it('Admin n"a pas le bouton Delete', () => {
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

        cy.intercept('GET', '/api/user/1', {
            statusCode: 200,
            body: {
            id: 1,
            email: 'yoga@studio.com',
            firstName: 'Admin',
            lastName: 'Admin',
            admin: true,
            createdAt: '2026-11-01T10:00:00.000Z',
            updatedAt: '2026-11-15T10:00:00.000Z'
            }
        }).as('user');

        cy.visit('/login');

        cy.get('input[formControlName=email]')
            .type('yoga@studio.com');

        cy.get('input[formControlName=password]')
            .type('test!1234');

        cy.get('button[type=submit]')
            .click();

        cy.wait('@sessions');

        cy.contains('Account')
            .click();

        cy.wait('@user');

        cy.url()
            .should('include', '/me');

        cy.contains('User information')
            .should('be.visible');

        cy.contains('Name: Admin ADMIN')
            .should('be.visible');

        cy.contains('Email: yoga@studio.com')
            .should('be.visible');

        cy.contains('Delete my account:')
            .should('not.exist');

        cy.contains('button', 'Delete')
            .should('not.exist');
    });
});