/// <reference types="cypress" />

describe('Logout', () => {
    it('Déconnexion du user et redirection vers login', () => {
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

        cy.visit('/login');

        cy.get('input[formControlName=email]')
        .type('user@test.com');

        cy.get('input[formControlName=password]')
        .type('password123');

        cy.get('button[type=submit]')
        .click();

        cy.wait('@sessions');

        cy.url()
        .should('include', '/sessions');

        cy.contains('Logout')
        .should('be.visible')
        .click();

        cy.url()
        .should('include', '/login');

        cy.contains('Login')
        .should('be.visible');

        cy.contains('Register')
        .should('be.visible');
    });
});