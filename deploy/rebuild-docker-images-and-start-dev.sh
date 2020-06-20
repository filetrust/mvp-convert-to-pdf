cd docker
docker-compose  -f ./docker-compose.dev.yml build --force-rm

docker-compose -f ./docker-compose.dev.yml up -t 0
