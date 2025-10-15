# Use the official lightweight Nginx image
FROM nginx:stable-alpine

# Remove the default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom production configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf