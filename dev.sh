#!/bin/bash

docker-compose -f docker-compose-frontend.yml down
docker-compose -f docker-compose-frontend.yml up -d
docker-compose -f docker-compose-server.yml down
docker-compose -f docker-compose-server.yml up -d

