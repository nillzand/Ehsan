# Use the official Nginx image
FROM nginx:stable-alpine

# Remove the default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom configuration file from the nginx directory
COPY nginx.conf /etc/nginx/conf.d/default.conf