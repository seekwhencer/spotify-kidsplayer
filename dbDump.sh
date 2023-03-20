#!/bin/bash

loadConfig() {
    export DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export $(egrep -v '^#' "${DIR}/.env" | xargs)
}

loadConfig

docker exec ${PROJECT_NAME}_mysql /usr/bin/mysqldump --no-data -u ${DB_USER} --password=${DB_ROOT_PASS} ${DB_NAME} > ./mysql/backup.sql
