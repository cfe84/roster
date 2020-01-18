#!/bin/bash

VERSION=7.1.8
PLATFORM=darwin
ARCH=x64

usage() {
  echo "pack.sh -v 7.1.8 -p darwin/win32 -a x64"
}

while [[ $# -gt 0 ]]
do
    key="$1"
    shift

    case $key in
        -v|--version)
            VERSION="$1"
            shift
        ;;
        -p|--platform)
            PLATFORM="$1"
            shift
        ;;
        -a|--arch)
            ARCH="$1"
            shift
        ;;
        *)
            echo "Unknown parameter: $key"
            usage
        ;;
    esac
done

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
FOLDERNAME=electron-v${VERSION}-${PLATFORM}-${ARCH}
FILENAME=${FOLDERNAME}.zip
CACHE=$SCRIPTPATH/cache
BIN=$SCRIPTPATH/bin
SOURCE_APP_DIRECTORY=dist
PACKAGE_FILE=package.json
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

if [ "$PLATFORM" = "darwin" ]; then
  CONTENTS_FOLDER=$CACHE/$FOLDERNAME/Electron.app/Contents
  RESOURCES_FOLDER=$CONTENTS_FOLDER/Resources
  TARGET_APP_DIRECTORY=$RESOURCES_FOLDER/app
  mkdir $TARGET_APP_DIRECTORY
  cp -r $SOURCE_APP_DIRECTORY $TARGET_APP_DIRECTORY
  cp $PACKAGE_FILE $TARGET_APP_DIRECTORY
  cp ./package/icon.icns $RESOURCES_FOLDER/electron.icns
  cp ./package/Info.plist $CONTENTS_FOLDER/Info.plist
  mv $CONTENTS_FOLDER/MacOS/Electron $CONTENTS_FOLDER/MacOS/Roster
fi

if [ -d $OUTPUT ]; then
  rm -r $OUTPUT
fi
mkdir -p $OUTPUT

if [ "$PLATFORM" = "darwin" ]; then
  cp -r $CACHE/$FOLDERNAME/Electron.app/ $OUTPUT
fi

echo "Packaged in $OUTPUT"
