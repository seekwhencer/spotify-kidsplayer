#!/bin/bash

loadConfig() {
    export DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export $(egrep -v '^#' "${DIR}/.env" | xargs)
}

loadConfig

cat backup.sql | docker exec -i ${PROJECT_NAME}_mysql /usr/bin/mysql -u ${DB_USER} --password=${DB_ROOT_PASS} ${DB_NAME}