# Variables
DOCKER_COMPOSE = sudo docker compose -f ./src/docker-compose.yml
DOCKER = sudo docker
BACKEND = backend
FRONTEND = frontend
E2E_TEST = tests_e2e
UNIT_TEST = unit_test
NGINX = nginx
DB = db
NETWORK_MODE = host
ARGS := $(filter-out $(firstword $(MAKECMDGOALS)),$(MAKECMDGOALS))
DB_IP = $(shell $(DOCKER) inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' db)


# Build and run the container except tests
all:
	$(DOCKER_COMPOSE) build

build:
	$(DOCKER_COMPOSE) build $(ARGS)

up:
	$(DOCKER_COMPOSE) up

buildup-app:
	$(DOCKER_COMPOSE) up --build $(BACKEND) $(FRONTEND) $(DB) $(NGINX)

buildup-detached:
	$(DOCKER_COMPOSE) up --build -d $(BACKEND) $(FRONTEND) $(DB) $(NGINX)

up-container:
	$(DOCKER_COMPOSE) up --build $(ARGS)

# Stop the container
stop:
	$(DOCKER_COMPOSE) down $(ARGS)

clean-container:
	$(DOCKER_COMPOSE) down -v --remove-orphans $(ARGS)

# Remove containers, networks, and volumes
clean:
	$(DOCKER_COMPOSE) down -v --remove-orphans
	sudo docker system prune -a -f

restart-all:
	$(DOCKER_COMPOSE) restart $(BACKEND) $(FRONTEND) $(DB) $(NGINX)

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

e2e_test:
	@echo "Running Cypress tests with tags: $(ARGS)"
	$(DOCKER_COMPOSE) up --build $(E2E_TEST)

unit_test:
	@echo "Running unit tests with tags: $(ARGS)"
	$(DOCKER_COMPOSE) up --build $(UNIT_TEST)

pg_cli:
	pgcli -h $(DB_IP) -U postgres -d postgres

%:
	@: