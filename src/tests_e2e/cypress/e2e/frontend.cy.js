
describe('Frontend smoke Test', { tags: ['@smoke', "@frontend"]}, () => {
	it('should see the home page', () => {
		cy.request('/').its('status').should('eq', 200)
	});
});
