# Use the official Node.js image as the base image for building the project
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Sapper project
RUN npm run build

# Use the official nginx image to serve the built files
FROM nginx:alpine

# Copy the built files from the build stage to the nginx html directory
COPY --from=build /app/__sapper__/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]