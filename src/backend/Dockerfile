# Use Node.js base image
FROM node:16

WORKDIR /backend

RUN apt-get update && apt-get install -y netcat

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install --omit=optional

# Copy the rest of the app files
COPY . .

RUN chmod +x /backend/entry.sh

EXPOSE 3000

ENTRYPOINT ["/backend/entry.sh"]
