# Use the official Node.js Alpine image as the base image for building the project
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install system dependencies for canvas
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    libpng-dev \
    pkgconfig

# Copy package.json and package-lock.json to the working directory
# COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies

# Copy the rest of the application code to the working directory
COPY ./frontend ./frontend

WORKDIR /app/frontend
RUN npm install
# # Ensure configuration files are copied
# COPY frontend/rollup.config.js ./ 
# # or

# # Copy the src directory
# COPY frontend/src ./src

# Build the Sapper project
RUN npm run build

# Use the official nginx image to serve the built files

# Copy the built files from the build stage to the nginx html directory
# COPY --from=build /app/__sapper__/build /usr/share/nginx/html


# Expose port 80
EXPOSE 80

CMD ["npm", "run", "start"]