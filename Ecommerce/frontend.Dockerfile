# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Add build tools (needed for some npm packages)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

# Accept build-time API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
