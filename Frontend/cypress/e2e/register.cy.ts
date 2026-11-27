/// <reference types="cypress" />

describe('Register', () => {
    it('Inscription réussie', () => {
        cy.intercept('POST', '/api/auth/register', {
        statusCode: 200,
        body: {}
        }).as('register');

        cy.visit('/register');

        cy.get('input[formControlName=firstName]')
        .type('John');

        cy.get('input[formControlName=lastName]')
        .type('Doe');

        cy.get('input[formControlName=email]')
        .type('john.doe@test.com');

        cy.get('input[formControlName=password]')
        .type('password123');

        cy.get('button[type=submit]')
        .click();

        cy.wait('@register')
        .its('request.body')
        .should('deep.equal', {
            email: 'john.doe@test.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
        });

        cy.url().should('include', '/login');
    });

    it('Inscription KO si champs vides', () => {
        cy.visit('/register');

        cy.get('input[formControlName=firstName]')
            .should('have.value', '');

        cy.get('input[formControlName=lastName]')
            .should('have.value', '');

        cy.get('input[formControlName=email]')
            .should('have.value', '');

        cy.get('input[formControlName=password]')
            .should('have.value', '');

        cy.get('button[type=submit]')
            .should('be.disabled');
    });
});