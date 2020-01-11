#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
VERSION=7.1.8
PLATFORM=darwin
ARCH=x64
FOLDERNAME=electron-v${VERSION}-${PLATFORM}-${ARCH}
FILENAME=${FOLDERNAME}.zip
CACHE=$SCRIPTPATH/cache
BIN=$SCRIPTPATH/bin
SOURCE_APP_DIRECTORY=dist
PACKAGE_FILE=package.json
RESOURCES_FOLDER=$CACHE/$FOLDERNAME/Electron.app/Contents/Resources
TARGET_APP_DIRECTORY=$RESOURCES_FOLDER/app
OUTPUT_FOLDER_NAME=roster-${PLATFORM}-${ARCH}
OUTPUT_FILE_NAME=roster.app
OUTPUT=$BIN/$OUTPUT_FOLDER_NAME/$OUTPUT_FILE_NAME

mkdir -p $CACHE
if [ ! -f $CACHE/$FILENAME ]; then
  curl -L https://github.com/electron/electron/releases/download/v${VERSION}/$FILENAME --output $CACHE/$FILENAME
fi
if [ -d $CACHE/$FOLDERNAME ]; then
  rm -r $CACHE/$FOLDERNAME
fi

unzip $CACHE/$FILENAME -d $CACHE/$FOLDERNAME > /dev/null
mkdir $TARGET_APP_DIRECTORY
cp -r $SOURCE_APP_DIRECTORY $TARGET_APP_DIRECTORY
cp $PACKAGE_FILE $TARGET_APP_DIRECTORY

if [ -d $OUTPUT ]; then
  rm -r $OUTPUT
fi
mkdir -p $OUTPUT

cp -r $CACHE/$FOLDERNAME/Electron.app/ $OUTPUT

echo "Packaged in $OUTPUT"