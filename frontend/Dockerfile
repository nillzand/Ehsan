# ---- Stage 1: Build the React App ----
FROM node:20-alpine AS build

WORKDIR /app

# ---- NEW: Define build arguments ----
# This declares a build-time variable that we can pass from docker-compose.
# We can also give it a default value for safety.
ARG VITE_API_BASE_URL=/api

# ---- NEW: Set the environment variable ----
# This makes the ARG available as a regular environment variable
# for the subsequent RUN commands.
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install
COPY . .

# Now, when this command runs, it will have access to process.env.VITE_API_BASE_URL
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
# This stage just copies the finished build; it doesn't need the variables.
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# We will handle the nginx.conf from the main Nginx service, so no need to copy it here.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]