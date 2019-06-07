FROM node:10-alpine

WORKDIR /api

ADD package.json /api

RUN npm install

ADD . /api

# To use local packages like they are globally
RUN npm link

CMD npm start 
