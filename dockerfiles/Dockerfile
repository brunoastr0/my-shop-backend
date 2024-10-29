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
COPY tsconfig.json ./
COPY types ./types

RUN npm run build

# RUN npx prisma db pull
# Set the environment variable for admin to apply migrations
# This should match the env variable in your .env file
# ENV DATABASE_URL="postgresql://postgres:postgrespassword@172.24.0.1:5432/my-shop?schema=public"
# Generate Prisma client
RUN npx prisma generate


# Expose the application port
EXPOSE 3000

# Command to run the application
# CMD ["npm","run","dev", "app/server.ts"]
CMD ["npm","run","dev"]
