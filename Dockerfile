FROM node:20-alpine

# Install openssl for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files from back-end
COPY back-end/package.json .

# Install all dependencies
RUN npm install

# Copy prisma schema
COPY back-end/prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the backend code
COPY back-end/ .

EXPOSE 5000

CMD ["node", "src/server.js"]
