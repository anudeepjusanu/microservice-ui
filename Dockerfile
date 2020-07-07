FROM node:10
MAINTAINER Anudeep
RUN mkdir /app
#RUN npm i
ADD . /app
WORKDIR /app
COPY package.json ./

RUN npm i --silent
RUN npm run build
CMD [ "npm", "run", "start:prod" ]