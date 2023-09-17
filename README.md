# reel-good

Help people determine what show or movie to watch based on their mood, interests, favorite genre, actors/actresses, award winning films, age of film, where can the movie be streamed.

# Development Environment Setup
The Web appliation runs in multiple containers. There is a container for the Flask backend, React frontend, and elasticsearch service. The custom images are stored in the Github container repository. To download the containers for x86 machines, execute the following commands to pull them. **Note**, if you are using a ARM based Mac, you probably will want to build the containers yourself for better performance and to avoid any issues. Use the command `docker compose build` or you can build each container manually using the `docker build` command.

```bash
$ docker pull ghcr.io/reelgoodosu/flask:latest
$ docker pull ghcr.io/reelgoodosu/react:latest
```

The containers mount the root directory of the project repo in order to access the frontend files and the backend. On the first startup of the React frontend the node modules must be installed. This can be done by issuing the following command.

```bash
$ docker run --rm -it -u node -v ./:/app ghcr.io/reelgoodosu/react:latest bash

# Issue the following commands inside the container
$ cd /app
$ npm install
```

The following commands will install the necessary dependicies for React within the working directory of the repository. If we were building containers for production we would probably just add the node modules to the container along with the scripts for the frontend but since we will probably change things during development I decided to make this all just on a local volume rather than inside the container.

Several environment variables are passed to the `docker-compose.yml` file via the `.env` file. Note that this is specific to each machine and thus is not tracked in . A template of the `.env` file can be found at `docker_compose_env`.

The elasticsearch container may fail to start up in the event `vm.max_map_count` is not set to at least `262144` to fix this execute the following command as root.

```bash
$ sysctl -w vm.max_map_count=262144
```

The Elasticsearch container uses a helper container to start up the actual elasticsearch node. This container will exit once it is finished. The Elasticsearch container utilizes local volumes on the host machine. This prevents the data stored/used by a container being lost if the container gets deleted. In the event you want to delete the volumes after you are finished using the container, executing the command `docker compose down -v` will delete the containers and associated volumes used.

The container uses https, so we need a password and certificate to interact with the elasticsearch API. The password is found in the `.env` file. The certificate is stored in the local certs volume. To copy the certificate to your machine use the following command.

```bash
$ docker cp reel-good-es01-1:/usr/share/elasticsearch/config/certs/ca/ca.crt ./
```

To verify that you can interact with the container you can execute the following command.

```bash
$ curl --cacert ./ca.crt -u elastic:<elastic_password> https://localhost:9200
```

## Starting the Development Environment
To start running the service execute `docker compose up`. When finished, you can issue the command `docker compose down` or `docker compose down -v` if you want to delete the volumes used for the elasticsearch data. Note that both of these command should be executed from the root directory of the project.

The docker containers mount the local directory of the project and run the code from there, so the code and be modified on the fly.

## Docker Compose Assumptions
The`docker-compose.yml` file assumes that a React project has been initialized in the root directory of the project and that a proxy has been set up to `http://api:5000`. In addition, a Flask project is assumed to be set up in the `api/` folder. **Note**, it is very important that the proxy to `http://api:5000` is set up or the React frontend will not know how to interact with the Flask backend.

# Credits and Acknowledgements
The following [blog](https://www.elastic.co/blog/getting-started-with-the-elastic-stack-and-docker-compose) from Elasticsearch was used to set up the `docker-compose.yml` file components related to elasticsearch.
