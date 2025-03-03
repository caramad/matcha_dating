const { Client } = require('pg');

module.exports = {
	e2e: {
		baseUrl: "http://nginx:80",
		supportFile: false,
		setupNodeEvents(on, config) {
			config.env.grepFilterSpecs = true;
			config.env.grepIntegrationFolder = '../../';
			config.env.grepOmitFiltered = true;

			// Add database query support
			on('task', {
				async queryDb(query) {
					const client = new Client({
						user: process.env.DB_USER,
						host: process.env.DB_HOST,
						database: process.env.DB_NAME,
						password: process.env.DB_PASSWORD,
						port: process.env.DB_PORT,
					});

					await client.connect();
					const res = await client.query(query);
					await client.end();
					return res.rows;
				}
			});

			return config;
		}
	}
};
