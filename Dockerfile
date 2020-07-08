FROM node
ADD /package.json /tmp/package.json
WORKDIR /tmp
ADD . /tmp/
RUN npm install
EXPOSE 3000
ENTRYPOINT npm run start:production