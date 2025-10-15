# ---- Stage 1: Build the React App ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# The image build stops here. The 'dist' folder is all we need from this.