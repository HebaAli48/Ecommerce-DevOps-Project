# Use Node.js v22 official image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# # Copy .env file into the container
# COPY .env .env



# Start the application
CMD ["npm", "start"]
