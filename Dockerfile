FROM node:20-alpine

# Install openssl for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files from back-end (lock file ensures reproducible installs)
COPY back-end/package.json back-end/package-lock.json ./

# Install dependencies with legacy-peer-deps to resolve multer / multer-storage-cloudinary conflict
RUN npm ci --legacy-peer-deps

# Copy prisma schema
COPY back-end/prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the backend code
COPY back-end/ .

EXPOSE 5000

CMD ["node", "src/server.js"]
