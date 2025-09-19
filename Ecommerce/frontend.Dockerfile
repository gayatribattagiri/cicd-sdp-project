# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Install build tools (for packages like bcrypt/sharp if needed)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve production with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
