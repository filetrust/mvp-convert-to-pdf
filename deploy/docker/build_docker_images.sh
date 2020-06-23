echo "building all docker images"

cd api || exit
./build-docker-image.sh

cd ../client || exit
./build-docker-image.sh
