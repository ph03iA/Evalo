FROM node:24-alpine AS build

WORKDIR /app

COPY package.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm ci --prefix backend
RUN npm ci --include=dev --prefix frontend

COPY backend ./backend
COPY frontend ./frontend

ARG VITE_API_URL=/api
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_STREAM_API_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_STREAM_API_KEY=$VITE_STREAM_API_KEY

RUN npm run build --prefix frontend
RUN npm prune --omit=dev --prefix backend


FROM node:24-alpine AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app/backend

COPY package.json /app/package.json
COPY --from=build /app/backend ./
COPY --from=build /app/frontend/dist ../frontend/dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]