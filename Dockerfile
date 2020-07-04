
FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# ENV TZ='Europe/Ireland'
# ENV MONGO_URI='mongodb://172.16:27017/wakecap'
EXPOSE 3003
CMD [ "node", "dist/server.js" ]

