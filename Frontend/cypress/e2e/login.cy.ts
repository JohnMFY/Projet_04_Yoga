/// <reference types="cypress" />

describe('Login', () => {

  it('Connexion réussie', () => {
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

    cy.visit('/login');

    cy.get('input[formControlName=email]')
      .type('yoga@studio.com');

    cy.get('input[formControlName=password]')
      .type('test!1234');

    cy.get('button[type=submit]')
      .click();

    cy.wait('@login')
      .its('request.body')
      .should('deep.equal', {
        email: 'yoga@studio.com',
        password: 'test!1234'
      });

    cy.url().should('include', '/sessions');
  });

  it('Connexion refusée avec de mauvais identifiants', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {}
    }).as('loginError');

    cy.visit('/login');

    cy.get('input[formControlName=email]')
      .type('wrong@test.com');

    cy.get('input[formControlName=password]')
      .type('wrongpassword');

    cy.get('button[type=submit]')
      .click();

    cy.wait('@loginError');

    cy.get('.error')
      .should('be.visible')
      .and('contain', 'An error occurred');

    cy.url().should('include', '/login');
  });
  
  it('Empêche la connexion si les champs obligatoires sont vides', () => {
    cy.visit('/login');

    cy.get('input[formControlName=email]')
      .should('have.value', '');

    cy.get('input[formControlName=password]')
      .should('have.value', '');

    cy.get('button[type=submit]')
      .should('be.disabled');
  });
});