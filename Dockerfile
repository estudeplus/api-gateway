FROM node:10-alpine

WORKDIR /api

ADD package.json /api

RUN npm install

ADD . /api

RUN npm link

CMD npm start 
