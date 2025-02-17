# Use Node.js base image
FROM node:16

WORKDIR /backend

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install --omit=optional

# Copy the rest of the app files
COPY . .

EXPOSE 3000

# Start the app in dev mode
CMD ["npm", "run", "dev"]
