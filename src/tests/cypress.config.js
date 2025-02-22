
/* const targets = {
  frontend: networkMode === "docker" ? "http://frontend:5000" : "http://host.docker.internal:5000",
  backend: networkMode === "docker" ? "http://backend:3000" : "http://host.docker.internal:3000",
  db: networkMode === "docker" ? "http://db:5432" : "http://host.docker.internal:5432"
}; */

module.exports = {
	e2e: {
		//baseUrl: targets[target] || targets["frontend"], // Default to frontend
		baseUrl: "http://nginx:80",
		supportFile: false,
		setupNodeEvents(on, config) {
			config.env.grepFilterSpecs = true;
			config.env.grepIntegrationFolder = '../../';
			config.env.grepOmitFiltered = true
			return config;
		}
	}
};
