#FROM node:19
#
## Create app directory
#WORKDIR /usr/src/app
#
## Install app dependencies
## A wildcard is used to ensure both package.json AND package-lock.json are copied
## where available (npm@5+)
#COPY package*.json ./
#
#RUN yarn install
## If you are building your code for production
## RUN npm ci --only=production
#
## Bundle app source
#COPY . .
#
#EXPOSE 3001
#CMD [ "yarn", "start" ]

# ---- 1. Install dependencies ----
FROM node:20-alpine AS deps

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else echo "No lock file found." && exit 1; \
  fi

# ---- 2. Build app ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN npm run build

# ---- 3. Run app ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Install only production deps
COPY package.json ./
RUN npm install --omit=dev

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["npm", "start"]

