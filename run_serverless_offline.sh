#!/usr/bin/env bash

export API_SERVICE_NAME='guild-test'
export API_AWS_REGION=''
export API_DB_HOST='127.0.0.1'
export API_DB_HOST_READ='127.0.0.1'
export API_KEY='my-key'
export API_SUBNET=''
export API_USERNAME='root'
export API_PASSWORD='tcuser'
export API_DATABASE='guild'
export API_PORT='23306'
export API_PORT_READ='23306'
export LOGGING_LEVEL='INFO'

echo "Building project..."
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "An error occurred when building the project!"
    exit 1;
fi

HOST=""

if [ -n "$1" ]; then
    HOST="--host=$1"
fi

echo "Project has built; starting serverless offline..."
./node_modules/.bin/serverless offline start ${HOST} --noPrependStageInUrl

unset API_SERVICE_NAME
unset API_AWS_REGION
unset API_DB_HOST
unset API_DB_HOST_READ
unset API_KEY
unset API_SUBNET
unset API_USERNAME
unset API_PASSWORD
unset API_DATABASE
unset API_PORT
unset API_PORT_READ
unset LOGGING_LEVEL
