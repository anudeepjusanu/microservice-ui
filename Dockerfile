FROM node:10
MAINTAINER Anudeep
WORKDIR /app

ADD package.json /app
ADD internals/ /app
RUN npm install
COPY . /app
EXPOSE 3000
RUN npm run build
ENTRYPOINT npm run start:prod