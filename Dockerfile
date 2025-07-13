# Use the official Node.js 18 LTS image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first, using cache if possible
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the app for production
RUN yarn build

# Final stage: serve the app using production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy over built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3001

# Run the Next.js production server
CMD ["yarn", "start"]
