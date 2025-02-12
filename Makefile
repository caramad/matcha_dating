# Variables
DOCKER_COMPOSE = sudo docker compose -f ./src/docker-compose.yml
SERVICE_NAME = app

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
restart: stop up

# Show running containers
ps:
	sudo docker ps

# View logs
logs:
	$(DOCKER_COMPOSE) logs -f

# Enter the running container's shell
shell:
	sudo docker exec -it $$(docker ps -q --filter name=$(SERVICE_NAME)) /bin/sh
