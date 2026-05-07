FROM node:20-alpine

# Set environment to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies (production only)
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]