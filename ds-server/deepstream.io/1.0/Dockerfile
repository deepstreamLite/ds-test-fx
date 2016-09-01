# Pull base image.
FROM mhart/alpine-node:4

# Install build tools to compile native npm modules
RUN apk add --update build-base python git

# Create app directory
RUN mkdir -p /usr/local/deepstream/
WORKDIR /usr/local/deepstream/deepstream.io

# Install deepstream as an application dependency
#RUN npm install deepstream.io deepstream.io-logger-winston --production
RUN git clone https://github.com/deepstreamIO/deepstream.io . && npm install && npm install deepstream.io-msg-redis

# Link to volumes
VOLUME [ "/usr/local/deepstream/conf", "/usr/local/deepstream/var" ]

# Copy default config files
COPY conf /usr/local/deepstream/deepstream.io/conf

# Define default command.
CMD [ "node", "bin/deepstream" ]

# Expose ports

# TCP Port
EXPOSE 6021
