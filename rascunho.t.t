RUN: docker run --env-file .env -p 3000:3000 dashboard-api

RUN IN LOCALHOST: docker run --env-file .env --add-host=host.docker.internal:host-gateway -p 3000:3000 dashboard-api

STOP ALL: docker stop $(docker ps -q)


