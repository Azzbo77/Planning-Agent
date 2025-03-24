FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server.js ./
EXPOSE 8090
CMD ["node", "server.js"]
