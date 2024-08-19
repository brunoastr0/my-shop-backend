# Use Node.js Alpine base image
FROM node:20-alpine

# Set the working directory
WORKDIR    /app

# Install dependencies
COPY ../package*.json ./
RUN npm ci --quiet


# Copy the rest of the application code
COPY ../app ./app
COPY ../database ./database/

RUN npm run build

# RUN npx prisma db pull

# Generate Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm","run","dev", "app/server.ts"]
