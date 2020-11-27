#!/bin/bash

# exit on error
set -e

echo "#### Nettoyage"
rm -rf ./build

echo "#### Creation du réportoire build"
mkdir build

echo "#### Build du website"
cd hidden-jvc-website
export USE_SUB_FOLDER=1
npm run build
mv ./dist ../build/hidden-jvc-website
cd ..

echo "#### Build de l'extention"
npm run build

echo "#### Déplacement du manifest"
cp ./manifest.json ./build/manifest.json

echo "#### Déplacement des icones"
cp -r ./src/icons ./build/.

echo "#### Creation de l'archive"
cd ./build
7z a -tzip hidden-jvc-extension.zip *
