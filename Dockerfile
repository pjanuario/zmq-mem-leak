FROM node:10-alpine

ENV APP_DIR=/app

COPY package.json package-lock.json $APP_DIR/
RUN chown -R node:node $APP_DIR

WORKDIR $APP_DIR

RUN apk add --no-cache make gcc g++ python zeromq zeromq-dev \
  && npm install zeromq --zmq-external \
  && npm install \
  && npm cache clean --force\
  && apk del make gcc g++ python zeromq-dev

ADD . $APP_DIR

RUN chown -R node:node $APP_DIR

USER node

CMD ["node", "broker.js"]
