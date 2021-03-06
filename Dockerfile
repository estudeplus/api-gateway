FROM node:10-alpine

WORKDIR /api

ADD package.json /api

RUN apk add --update python python-dev py2-pip autoconf automake g++ make --no-cache \
&& pip install py-bcrypt

RUN npm install

ADD . /api

# To use local packages like they are globally
RUN npm link

CMD npm start
