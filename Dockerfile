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

# ---- Graft build ----
# Compiles just src/services + its two dependencies (GQLQueries, internal)
# with `declaration: true` (tsconfig.graft.json). The plain `npm run build`
# output has no .d.ts files, so gg's static analyzer would only see untyped
# JS and generate an `any`-typed contract - the declaration files are what
# let it produce the real method/DTO types.
FROM build AS graft-build
RUN npm run build:graft

# ---- Graftcode Gateway ----
# The compiled src/services/* module has zero runtime npm dependencies (it
# only uses global fetch), so this stage needs nothing from `npm ci` - just
# the compiled JS/d.ts plus the `gg` binary. Debian-based (not the alpine
# base above) because `gg` ships as a .deb package.
FROM node:24 AS graft
WORKDIR /usr/app
COPY --from=graft-build /app/dist-graft/services ./services
COPY --from=graft-build /app/dist-graft/GQLQueries ./GQLQueries
COPY --from=graft-build /app/dist-graft/internal ./internal
COPY graft/package.json ./package.json

RUN apt-get update \
 && apt-get install -y --no-install-recommends wget \
 && ARCH=$(dpkg --print-architecture) \
 && wget -q -O /usr/app/gg.deb "https://github.com/grft-dev/graftcode-gateway/releases/latest/download/gg_linux_${ARCH}.deb" \
 && dpkg -i /usr/app/gg.deb \
 && rm /usr/app/gg.deb \
 && apt-get purge -y --auto-remove wget \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Port 80 handles graft service calls, port 81 serves Graftcode Vision.
# --modules (not a bare positional package.json path) and --runtime nodejs
# are required by this gateway version - confirmed via `gg --help` in this
# image rather than assumed from docs written for a different gg release.
EXPOSE 80
EXPOSE 81

CMD ["gg", "--modules", "./package.json", "--runtime", "nodejs"]
