describe('Shopping list test', () => {
    it('I see a welcome screen without a list', () => {
      cy.visit('http://localhost:3000/')
      cy.get('h1').should('have.text', 'Welcome to your Smart Shopping list!')
    })

    it("I can create a new list if I don't have one already", () => {
      cy.get('.create>button').should('have.text', 'Create a new list').click();
      cy.get('h1').should('have.text', 'Shopping List')
      cy.get('button').contains('Add Item').click();
      cy.get('#itemName').type('Bread-problem');
      cy.get('#submit').click();
      cy.get('.links a').first().click();
      cy.get('p.item-name').should('have.text', 'Bread');
      cy.get('.item-wrapper').should('have.class', 'green-bg')
    })

    })
