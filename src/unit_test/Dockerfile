# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy only unit test files (backend is mounted separately)
COPY ./tests /app/tests

# Run unit tests and keep container running
CMD ["npm", "test"]
