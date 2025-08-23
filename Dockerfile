# Simple NGINX-based image to serve the static Snake game
# Uses a small base image for fast builds and small footprint
FROM nginx:alpine

# Set working directory to NGINX html directory
WORKDIR /usr/share/nginx/html

# Remove default NGINX static assets
RUN rm -rf ./*

# Copy project static files into the image
# We copy only what's needed to run the app in the browser
COPY index.html ./
COPY styles.css ./
COPY src ./src

# Expose default HTTP port
EXPOSE 80

# Use the default NGINX command
CMD ["nginx", "-g", "daemon off;"]
