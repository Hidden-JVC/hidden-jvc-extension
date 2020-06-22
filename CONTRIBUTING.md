# Setup son environnement de développement

## Prérequis

* Docker

* Node.js

Le projet est réparti sur 4 répos:

## L'extension web

    git clone https://github.com/Hidden-JVC/hidden-jvc-extension
    cd hidden-jvc-extension
    npm ci

Pour développer:

    npm run watch

Pour build:

    npm run build

## Le serveur
L'api REST qui permet d'intérroger la bdd en postgres.

    git clone https://github.com/Hidden-JVC/hidden-jvc-server
    cd hidden-jvc-server
    npm ci

Lancer la bdd:

    docker-compose up

Lancer le serveur:

    npm start

## Le site web
Le site web qui permet de consulter Hidden JVC en dehors de JVC.

    git clone https://github.com/Hidden-JVC/hidden-jvc-website
    cd hidden-jvc-website
    npm ci

Pour développer:

    npm run serve

## Le markup language
Implémentation de jvcode.

    git clone https://github.com/Hidden-JVC/open-jvcode
    cd open-jvcode
    npm ci
