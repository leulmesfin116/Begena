FROM node:20-alpine

# Install openssl for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package.json .

# Install all dependencies (including devDependencies for prisma CLI)
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]