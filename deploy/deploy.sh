#!/bin/bash

echo "Setting up GCLOUD auth"
gcloud auth activate-service-account --key-file ${TRAVIS_BUILD_DIR}/deploy/gcloud-key.json

gcloud --quiet config set project $PROJECT_ID
gcloud --quiet config set container/cluster $CLUSTER 
gcloud --quiet config set compute/zone $ZONE 

echo "Getting cluster credentials"
gcloud --quiet container clusters get-credentials $CLUSTER

echo "Authenticating on DockerHub"
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin


echo "Pushing new image"
docker push ${ORG_NAME}/${IMAGE_NAME}:$TRAVIS_COMMIT

echo "Setting new image on deployment"
kubectl set image deployment/${DEPLOYMENT} ${CONTAINER}=${ORG_NAME}/${IMAGE_NAME}:$TRAVIS_COMMIT
