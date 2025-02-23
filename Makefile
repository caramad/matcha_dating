# Variables
DOCKER_COMPOSE = sudo docker compose -f ./src/docker-compose.yml
DOCKER = sudo docker
BACKEND = backend
FRONTEND = frontend
TESTS = tests
NGINX = nginx
DB = db
NETWORK_MODE = host
ARGS := $(filter-out $(firstword $(MAKECMDGOALS)),$(MAKECMDGOALS))
DB_IP = $(shell $(DOCKER) inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' db)


# Build and run the container except tests
up:
	$(DOCKER_COMPOSE) up --build $(BACKEND) $(FRONTEND) $(DB) $(TESTS) $(NGINX)

up-container:
	$(DOCKER_COMPOSE) up --build $(ARGS)

# Run the container without rebuilding
start:
	$(DOCKER_COMPOSE) up

# Stop the container
stop:
	$(DOCKER_COMPOSE) down $(ARGS)

clean-container:
	$(DOCKER_COMPOSE) down -v --remove-orphans $(ARGS)

# Remove containers, networks, and volumes
clean:
	$(DOCKER_COMPOSE) down -v --remove-orphans
	sudo docker system prune -a -f

# Restart the container
restart:
	$(DOCKER) restart $(ARGS)

# Show running containers
ps:
	sudo docker ps

# View logs
logs:
	$(DOCKER_COMPOSE) logs -f

# Enter the running container's shell
shell:
	sudo docker exec -it $(ARGS) sh

test:
	@echo "Running Cypress tests with tags: $(ARGS)"
	$(DOCKER) exec -it $(TESTS) /bin/sh -c "npm run test -- --env grepTags=\"$(ARGS)\" grepFilterSpecs=true grepDebug=true"

pg_cli:
	pgcli -h $(DB_IP) -U postgres -d postgres

%:
	@: