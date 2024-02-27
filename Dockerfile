# Use Node.js as base image
FROM node:16-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install dependencies
RUN npm i
# Copy rest of the application code
COPY . .

# Build the project
RUN npm run build

# Expose the port the app runs on
EXPOSE 9000

# Command to run the application
CMD [ "npm", "start" ]
