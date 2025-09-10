# ---- Frontend Build (Vite) ----
FROM node:18-alpine AS build
WORKDIR /app

# Install deps using package.json (no lock required)
COPY package.json ./
RUN npm install

# Copy rest of client source and build
COPY . .
RUN npm run build

# ---- Nginx Serve ----
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
