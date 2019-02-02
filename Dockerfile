FROM node:lts-alpine

# reaps zombie processes and forwards sigterm,sigint
# https://github.com/krallin/tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# install git so we can patch packages
RUN apk add --update git

# run nodejs in production mode
# to be overridden in development
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node
# and 9229 and 9230 (tests) for debug
ARG PORT=3000
ARG API_PORT=3001
ENV PORT $PORT
ENV API_PORT $API_PORT
EXPOSE $PORT $API_PORT 9229 9230

# set context to app directory
WORKDIR /app
# RUN chown -R node:node .

# app dependencies
COPY . .

# install dependencies and compile to js
RUN yarn ci:bootstrap
RUN yarn build

# reset modules to only prod dependencies
# ENV NODE_ENV $NODE_ENV
# RUN yarn --${NODE_ENV}}

ENTRYPOINT ["/tini", "--"]

# run node as a non-priviledged user
USER node

CMD ["yarn", "start"]
