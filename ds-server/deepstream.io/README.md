# deepstream.io docker image

## Supported tags and respective Dockerfile links

* 1.0.0, latest (1.0.0/Dockerfile)

[![deepstream.io](https://imagelayers.io/badge/deepstreamio/deepstream.io:latest.svg)](https://imagelayers.io/?images=deepstreamio/deepstream.io:latest)

A docker image of deepstream.io.

## How to use this image

Either download the latest image from dockerhub via

```shell
docker pull deepstreamio/deepstream.io
```

or clone this repository and build the image from the Dockerfile


```shell
git clone https://github.com/deepstreamIO/docker.git deepstream-docker
cd deepstream.io-docker/deepstream.io/1.0
docker build -t 'deepstream' .
```

###### Create a container

```shell
docker create -t -p 6020:6020 -p 6021:6021 \
  --name deepstream \
  -v $(pwd)/conf:/usr/local/deepstream/conf \
  -v $(pwd)/var:/usr/local/deepstream/var \
  deepstream
```

###### Run the container in the foreground

```shell
docker start -ia deepstream
```

You can detach your terminal by pressing <kbd>Ctrl</kbd>+<kbd>c</kbd>.<br>
💡 **NOTE:** Your container will continue running. You need to stop it via `docker stop deepstream`

###### Create a container and run it in the background

```shell
docker start deepstream
docker logs -f deepstream
```

###### Docker compose file

You can also use a docker-compose file instead of doing these steps manually:
- pull the image
- create a container
- start the container

Just run:

```
docker-compose up
```
