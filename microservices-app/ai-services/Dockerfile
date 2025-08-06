FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install || true
COPY . .
EXPOSE 4001 4002 4003 4004
CMD ["sh", "-c", "node summarization.js & node intent.js & node vector.js & node report.js && tail -f /dev/null"]
