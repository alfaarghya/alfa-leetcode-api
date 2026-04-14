# ---- Base ----
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Development ----
FROM base AS dev
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---- Build ----
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# ---- Production ----
FROM base AS prod
RUN npm ci --omit=dev --ignore-scripts
COPY --from=build /app/dist ./dist
COPY swagger.yaml ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
