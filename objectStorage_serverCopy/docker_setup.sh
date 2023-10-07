#!/bin/bash
echo
echo "Mode:"
echo "0 - setup Docker container"
echo "1 - stop and remove Docker container"
echo
echo "Choose the mode:"
read flag

if [ $flag -eq 0 ]
then
	echo
	echo "Building a new container"
	docker build . -t object_storage
	echo "Running the container"
	docker run -d -p 4123:4123 --restart unless-stopped object_storage
fi

if [ $flag -eq 1 ]
then
	container_id=$(docker ps -f "ancestor=object_storage" -q)
	echo "Destroying container $container_id"
	docker stop $container_id
	docker container rm $container_id
	echo "Deleting proxyservice image"
	docker rmi object_storage
fi