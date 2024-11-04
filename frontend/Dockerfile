# Use an official Node.js runtime as the base image
FROM node

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

# Expose the port your app runs on
EXPOSE 3000


# Set the default command to serve the build folder
CMD [ "npm", "start" ]

