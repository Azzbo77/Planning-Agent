FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
