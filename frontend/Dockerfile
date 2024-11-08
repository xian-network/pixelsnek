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

# Install pnpm    
RUN npm install -g pnpm

COPY ./frontend ./frontend

WORKDIR /app/frontend

RUN pnpm install --frozen-lockfile

RUN pnpm run build

EXPOSE 80

CMD ["pnpm", "run", "start"]