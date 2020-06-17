# cleaning
rm -rf ./build

# build extension
npm ci
npm run build

# build website
cd hidden-jvc-website
npm ci
npm run build
mv ./dist ../build/hidden-jvc-website
cd ..

cp ./manifest.json ./build/manifest.json

# create archive
cd ./build
zip -r hidden-jvc-extension.zip *