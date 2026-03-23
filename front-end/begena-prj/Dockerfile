# Stage 1: Build the app
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Build arg so Vite can bake in the API URL at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with a lightweight static server
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 10000

CMD ["serve", "-s", "dist", "-l", "10000"]
