/// <reference types="cypress" />

describe('Sessions', () => {
    it('Affiche les sessions', () => {
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
            date: '2026-12-01T10:00:00.000Z',
            teacher_id: 1,
            description: 'description session 1',
            users: []
            },
            {
            id: 2,
            name: 'Session 2',
            date: '2026-12-02T14:00:00.000Z',
            teacher_id: 2,
            description: 'description session 2',
            users: []
            }
        ]
        }).as('sessions');

        cy.visit('/login');

        cy.get('input[formControlName=email]')
        .type('yoga@studio.com');

        cy.get('input[formControlName=password]')
        .type('test!1234');

        cy.get('button[type=submit]')
        .click();

        cy.wait('@sessions').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);

        expect(interception.response?.body)
            .to.have.length(2);

        expect(interception.response?.body[0].name)
            .to.eq('Session 1');
        });

        cy.url()
        .should('include', '/sessions');

        cy.contains('Session 1')
        .should('be.visible');

        cy.contains('Session 2')
        .should('be.visible');
    });

    it('Affiche la session selectionnée', () => {
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
                date: '2026-12-01T10:00:00.000Z',
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
            date: '2026-12-01T10:00:00.000Z',
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

        cy.visit('/login');

        cy.get('input[formControlName=email]').type('yoga@studio.com');
        cy.get('input[formControlName=password]').type('test!1234');
        cy.get('button[type=submit]').click();

        cy.wait('@sessions');

        cy.contains('button', 'Detail')
            .click();

        cy.wait('@sessionDetail');
        cy.wait('@teacher');

        cy.url()
            .should('include', '/sessions/detail/1');

        cy.contains('Session 1')
            .should('be.visible');

        cy.contains('Margot DELAHAYE')
            .should('be.visible');

        cy.contains('description session 1')
            .should('be.visible');

        cy.contains('0 attendees')
            .should('be.visible');
    });

    it('Affiche les btns administrateur', () => {
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
                date: '2026-12-01T10:00:00.000Z',
                teacher_id: 1,
                description: 'description session 1',
                users: []
            },
            {
                id: 2,
                name: 'Session 2',
                date: '2026-12-02T14:00:00.000Z',
                teacher_id: 2,
                description: 'description session 2',
                users: []
            }
            ]
        }).as('sessions');

        cy.visit('/login');

        cy.get('input[formControlName=email]')
            .type('yoga@studio.com');

        cy.get('input[formControlName=password]')
            .type('test!1234');

        cy.get('button[type=submit]')
            .click();

        cy.wait('@sessions');

       cy.contains('button', 'Create')
        .should('be.visible');

        cy.contains('button', 'Detail')
        .should('be.visible');

        cy.contains('button', 'Edit')
        .should('be.visible');

        cy.get('button')
        .filter(':contains("Detail")')
        .should('have.length', 2);

        cy.get('button')
        .filter(':contains("Edit")')
        .should('have.length', 2);
    });

    it('btns administrateur hidden pour un user non-admin', () => {
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
            body: [
            {
                id: 1,
                name: 'Session 1',
                date: '2026-12-01T10:00:00.000Z',
                teacher_id: 1,
                description: 'description session 1',
                users: []
            }
            ]
        }).as('sessions');

        cy.visit('/login');

        cy.get('input[formControlName=email]').type('user@test.com');
        cy.get('input[formControlName=password]').type('password123');
        cy.get('button[type=submit]').click();

        cy.wait('@sessions');

        cy.contains('button', 'Detail')
            .should('be.visible');

        cy.contains('button', 'Create')
            .should('not.exist');

        cy.contains('button', 'Edit')
            .should('not.exist');
    });

    it('User s"inscrit à une session', () => {
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
            body: [
            {
                id: 1,
                name: 'Session 1',
                date: '2026-12-01T10:00:00.000Z',
                teacher_id: 1,
                description: 'description session 1',
                users: []
            }
            ]
        }).as('sessions');

        let detailCallCount = 0;

        cy.intercept('GET', '/api/session/1', (req) => {
            detailCallCount++;

            req.reply({
            statusCode: 200,
            body: {
                id: 1,
                name: 'Session 1',
                date: '2026-12-01T10:00:00.000Z',
                teacher_id: 1,
                description: 'description session 1',
                users: detailCallCount === 1 ? [] : [2]
            }
            });
        }).as('sessionDetail');

        cy.intercept('GET', '/api/teacher/1', {
            statusCode: 200,
            body: {
            id: 1,
            firstName: 'Margot',
            lastName: 'Delahaye'
            }
        }).as('teacher');

        cy.intercept('POST', '/api/session/1/participate/2', {
            statusCode: 200,
            body: {}
        }).as('participate');

        cy.visit('/login');

        cy.get('input[formControlName=email]').type('user@test.com');
        cy.get('input[formControlName=password]').type('password123');
        cy.get('button[type=submit]').click();

        cy.wait('@sessions');

        cy.contains('button', 'Detail')
            .click();

        cy.wait('@sessionDetail');
        cy.wait('@teacher');

        cy.contains('button', 'Participate')
            .should('be.visible')
            .click();

        cy.wait('@participate');
        cy.wait('@sessionDetail');

        cy.contains('1 attendees')
            .should('be.visible');

        cy.contains('button', 'Do not participate')
            .should('be.visible');
    });

    it('User se désinscrit d"une session', () => {
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
            body: [
            {
                id: 1,
                name: 'Session 1',
                date: '2026-12-01T10:00:00.000Z',
                teacher_id: 1,
                description: 'description session 1',
                users: [2]
            }
            ]
        }).as('sessions');

        let detailCallCount = 0;

        cy.intercept('GET', '/api/session/1', (req) => {
            detailCallCount++;

            req.reply({
            statusCode: 200,
            body: {
                id: 1,
                name: 'Session 1',
                date: '2026-12-01T10:00:00.000Z',
                teacher_id: 1,
                description: 'description session 1',
                users: detailCallCount === 1 ? [2] : []
            }
            });
        }).as('sessionDetail');

        cy.intercept('GET', '/api/teacher/1', {
            statusCode: 200,
            body: {
            id: 1,
            firstName: 'Margot',
            lastName: 'Delahaye'
            }
        }).as('teacher');

        cy.intercept('DELETE', '/api/session/1/participate/2', {
            statusCode: 200,
            body: {}
        }).as('unParticipate');

        cy.visit('/login');

        cy.get('input[formControlName=email]').type('user@test.com');
        cy.get('input[formControlName=password]').type('password123');
        cy.get('button[type=submit]').click();

        cy.wait('@sessions');

        cy.contains('button', 'Detail')
            .click();

        cy.wait('@sessionDetail');
        cy.wait('@teacher');

        cy.contains('button', 'Do not participate')
            .should('be.visible')
            .click();

        cy.wait('@unParticipate');
        cy.wait('@sessionDetail');

        cy.contains('0 attendees')
            .should('be.visible');

        cy.contains('button', 'Participate')
            .should('be.visible');
        });
});