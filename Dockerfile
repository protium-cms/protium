FROM node:lts-alpine

# reaps zombie processes and forwards sigterm,sigint
# https://github.com/krallin/tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# run nodejs in production mode
# to be overridden in development
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node
# and 9229 and 9230 (tests) for debug
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

# set context to app directory
WORKDIR /app

# app dependencies
COPY package.json .
COPY lerna.json .
COPY tsconfig.json .
COPY yarn.lock .

# app code
COPY packages ./packages

# install dependencies and compile to js
RUN yarn
RUN yarn bootstrap
RUN yarn build

ENTRYPOINT ["/tini", "--"]

# run node as a non-priviledged user
USER node
# RUN chown -R node:node .

CMD ["yarn", "start"]
