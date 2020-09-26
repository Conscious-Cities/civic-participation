#!/bin/bash

ARG1=$1

set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value

# Make sure working dir is same as this dir, so that script can be excuted from another working directory
PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$PARENT_PATH"

if [ "$ARG1" == "superfast" ]; then
    echo "Skipping contract compilation"
else
    cd ../contracts/eosio.boot
    if [ -e eosio.boot.wasm ]
    then
        echo "eosio.boot already built"
    else
        ./build.sh
    fi

    cd ../eosio.bios
    ./build.sh

    cd ../civic
    ./build.sh

    echo ""
    echo "Smart contracts have been built"
    echo "You can run './app.sh init fast' next time (unless contracts are changed)"
    echo ""
fi

# allow for block production to start
echo "Waiting 5s for blockchain node to start"
sleep 5

docker-compose exec dfuse /bin/bash /var/repo/blockchain/activate_features.sh
if [ $? -gt 0 ]
then
    exit 1
fi

cd "${PARENT_PATH}"
cd ../back-end
npm run-script bootstrap
if [ $? -gt 0 ]
then
    exit 1
fi