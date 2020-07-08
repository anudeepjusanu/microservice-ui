FROM node:10
MAINTAINER Anudeep
RUN mkdir /app
#RUN npm i
ADD . /app
WORKDIR /app
COPY package.json ./

RUN npm i --silent

EXPOSE 3000
RUN npm run build
ENTRYPOINT npm run start:prod