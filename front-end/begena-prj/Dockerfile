FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

EXPOSE 5173

# Run Vite in development mode, allowing external access
CMD ["npm", "run", "dev", "--", "--host"]
