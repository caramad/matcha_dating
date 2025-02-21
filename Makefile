# Variables
DOCKER_COMPOSE = sudo docker compose -f ./src/docker-compose.yml
DOCKER = sudo docker
SERVICE_NAME = backend
ARGS := $(filter-out $(firstword $(MAKECMDGOALS)),$(MAKECMDGOALS))

# Build and run the container
up:
	$(DOCKER_COMPOSE) up --build

# Run the container without rebuilding
start:
	$(DOCKER_COMPOSE) up

# Stop the container
stop:
	$(DOCKER_COMPOSE) down

# Remove containers, networks, and volumes
clean:
	$(DOCKER_COMPOSE) down -v
	sudo docker system prune -a -f

# Restart the container
restart:
# if $(ARGS) is empty, restart all services
# otherwise, restart the specified service
	ifeq ($(ARGS),)
		$(DOCKER) restart
	else
		$(DOCKER) restart $(ARGS)
	endif

# Show running containers
ps:
	sudo docker ps

# View logs
logs:
	$(DOCKER_COMPOSE) logs -f

# Enter the running container's shell
shell:
	sudo docker exec -it $(ARGS) /bin/sh

%:
	@: