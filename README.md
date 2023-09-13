# reel-good

Help people determine what show or movie to watch based on their mood, interests, favorite genre, actors/actresses, award winning films, age of film, where can the movie be streamed.

# Docker Setup
The Web appliation runs in multiple containers. There is a container for the Flask backend and the React frontend. The images are stored in Github container repository execute the following commands to pull them.

```bash
$ docker pull ghcr.io/reelgoodosu/flask:latest
$ docker pull ghcr.io/reelgoodosu/react:latest
```

To start running the service execute `$ docker compose up`. When finished, you can issue the command `$ docker compose down`. Note that both of these command should be executed from the root directory of the project.

The docker containers mount the local directory of the project and run the code from there, so the code and be modified on the fly.

## Docker Compose Assumptions
The`docker-compose.yml` file assumes that a React project has been initialized in the root directory of the project and that a proxy has been set up to `http://api:5000`. In addition, a Flask project is assumed to be set up in the `api/` folder. **Note**, it is very important that the proxy to `http://api:5000` is set up or the React frontend will not know how to interact with the Flask backend.
