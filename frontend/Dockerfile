# Use an official Node.js runtime as the base image for building the app
FROM node:16 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies separately
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the app for production
RUN npm run build

# Use Nginx to serve the app
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the port that Nginx runs on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
