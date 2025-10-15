# Use the official Node.js image. 'alpine' is a lightweight version.
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# The command to start the Vite development server
# The '-- --host' part is crucial to make the server accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host"]