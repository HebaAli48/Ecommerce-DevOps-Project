# Step 1: Build the React App
FROM nginx:alpine

# Copy the built files from the builder stage
COPY ./dist /usr/share/nginx/html

# Copy custom Nginx config for handling React routing
COPY ./nginx.conf /etc/nginx/nginx.conf
# Copy custom errors pages

COPY src/error-pages /usr/share/nginx/html/error-pages

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]