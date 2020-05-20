# Setup son environnement de développement

## Prérequis

* Docker

* Node.JS

## Installation

    mkdir hidden-jvc
    cd hidden-jvc

    git clone https://github.com/Hidden-JVC/hidden-jvc-server
    cd hidden-jvc-server
    npm ci
    cd ..

    git clone https://github.com/Hidden-JVC/hidden-jvc-extension
    cd hidden-jvc-extension
    npm ci
    cd ..

    git clone https://github.com/Hidden-JVC/hidden-jvc-website
    cd hidden-jvc-website
    npm ci
    cd ..

    git clone https://github.com/Hidden-JVC/open-jvcode
    cd open-jvcode
    npm ci
    cd ..

## Développement

    cd hidden-jvc-server
    docker-compose up
    npm start

    cd hidden-jvc-extension
    npm run watch

    cd hidde-jvc-website
    npm run serve