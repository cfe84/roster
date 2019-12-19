#!/bin/bash

read -p "Storage connection string >" CONNECTION_STRING
ENCODED_CONNECTION_STRING=`echo -n "$CONNECTION_STRING" | base64`
kubectl create secret generic storage --from-literal=CONNECTION_STRING="$CONNECTION_STRING"