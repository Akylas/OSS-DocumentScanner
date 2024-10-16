#!/usr/bin/env bash

POSITIONAL_ARGS=()

while [[ $# -gt 0 ]]; do
  case $1 in
    -p|--platform)
      PLATFORM="$2"
      shift # past argument
      shift # past value
      ;;
    -v|--version)
      VERSION="$2"
      shift # past argument
      shift # past value
      ;;
    -f|--flavor)
      FLAVOR=YES
      shift # past argument
      shift # past value
      ;;
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
    *)
      POSITIONAL_ARGS+=("$1") # save positional arg
      shift # past argument
      ;;
  esac
done

set -- "${POSITIONAL_ARGS[@]}" # restore positional parameters

echo "PLATFORM  = ${PLATFORM}"
echo "VERSION   = ${VERSION}"
echo "FLAVOR    = ${FLAVOR}"
echo "FLAVOR    = $(dirname $0)"

wget https://github.com/Akylas/OSS-DocumentScanner/releases/download/dev_resources/${PLATFORM}.zip
unzip ${PLATFORM}.zip