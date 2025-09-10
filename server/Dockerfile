# ---- Backend (Node.js) ----
FROM node:18-alpine AS base
WORKDIR /app

# Copy manifests first (layer caching)
COPY package.json ./

# Install only prod deps
RUN npm install --omit=dev

# Copy source
COPY src ./src

# Expose port
EXPOSE 4000

# Start
CMD ["npm", "start"]
