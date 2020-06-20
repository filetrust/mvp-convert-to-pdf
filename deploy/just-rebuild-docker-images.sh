cd docker
docker-compose build --force-rm
docker-compose -f ./docker-compose.dev.yml build