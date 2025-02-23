
describe('Backend API Smoke Tests', () => {
	it('should ping the backend', () => {
		cy.request('/api/ping').should((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('message', 'Ponga-me as bolas');
		})
	})
})

