# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package.json first (for efficient caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the Vite dev server with hot reloading
CMD ["npm", "run", "dev", "--", "--host", "--port", "5000"]
