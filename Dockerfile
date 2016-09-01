# Pull base image.
FROM mhart/alpine-node:4

RUN apk add --update git

# Create app directory
WORKDIR /usr/local/deepstream-client

ADD test-harness test-harness/
ADD package.json package.json
ADD shared shared/

RUN npm install

# Define default command.
CMD [ "node", "test-harness/client/app.js" ]

