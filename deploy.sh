#!/bin/bash

# Prompt for Docker username if not set
if [ -z "$DOCKER_USERNAME" ]; then
  read -p "Enter your Docker username: " DOCKER_USERNAME
fi

# Ask if the user wants to replace the URL in app.js and ingress.yaml
read -p "Do you want to replace the URL in app.js and ingress.yaml? (y/n): " url_choice
if [ "$url_choice" == "y" ]; then
  read -p "Enter the new URL (e.g., test.zorran.tech): " new_url
  echo "Updating URL in app.js and ingress.yaml..."
  # Backup original app.js and ingress.yaml
  cp client/app.js client/app.js.bak
  cp ingress.yaml ingress.yaml.bak
  # Replace the URL in app.js
  sed -i "s|: 'http://.*'; // Use the Ingress path|: 'http://$new_url/backend'; // Use the Ingress path|g" client/app.js
  # Replace the URL in apiURL definition in client/app.js
  sed -i "s|http://planner.zorran.tech/backend|http://$new_url/backend|g" client/app.js

  # Replace the URL in ingress.yaml
  sed -i "s|host: .*|host: $new_url|g" ingress.yaml
  UPDATE_APPJS=true
  UPDATE_INGRESS=true
else
  echo "Skipping URL replacement in app.js and ingress.yaml."
fi

# Ask if the user wants to rebuild Docker images
read -p "Do you want to rebuild Docker images? (y/n): " rebuild_choice
if [ "$rebuild_choice" == "y" ]; then
  echo "Building Docker images..."
  # Build frontend image
  (cd ./client && docker build -t $DOCKER_USERNAME/elizaplannerfrontend:latest .)
  # Build backend image
  (cd ./server && docker build -t $DOCKER_USERNAME/elizaplannerbackend:latest .)
  echo "Pushing Docker images to Docker Hub..."
  docker push $DOCKER_USERNAME/elizaplannerfrontend:latest
  docker push $DOCKER_USERNAME/elizaplannerbackend:latest
  echo "Updating deployment files with Docker images..."
  # Backup original deployment files
  cp backend-deployment.yaml backend-deployment.yaml.bak
  cp frontend-deployment.yaml frontend-deployment.yaml.bak
  # Replace image names in deployment files
  sed -i "s|image: .*$|image: $DOCKER_USERNAME/elizaplannerbackend:latest|g" backend-deployment.yaml
  sed -i "s|image: .*$|image: $DOCKER_USERNAME/elizaplannerfrontend:latest|g" frontend-deployment.yaml
  UPDATE_YAMLS=true
else
  echo "Skipping Docker image rebuild."
fi

# Ask if the user wants to deploy the resources
read -p "Do you want to deploy the resources? (y/n): " deploy_choice
if [ "$deploy_choice" == "y" ]; then
  echo "Deploying resources..."
  kubectl apply -f contour.yaml
  kubectl apply -f ingress.yaml
  kubectl apply -f backend-deployment.yaml
  kubectl apply -f frontend-deployment.yaml

  # Restore original YAML files if they were modified
  if [ "$UPDATE_YAMLS" == "true" ]; then
    echo "Restoring original deployment files..."
    mv backend-deployment.yaml.bak backend-deployment.yaml
    mv frontend-deployment.yaml.bak frontend-deployment.yaml
  fi

  # Restore original app.js and ingress.yaml if they were modified
  if [ "$UPDATE_APPJS" == "true" ]; then
    echo "Restoring original app.js..."
    mv client/app.js.bak client/app.js
  fi
  if [ "$UPDATE_INGRESS" == "true" ]; then
    echo "Restoring original ingress.yaml..."
    mv ingress.yaml.bak ingress.yaml
  fi

  echo "Deployment complete."
else
  echo "Skipping deployment."
  # Restore original app.js and ingress.yaml if they were modified but deployment was skipped
  if [ "$UPDATE_APPJS" == "true" ]; then
    echo "Restoring original app.js..."
    mv client/app.js.bak client/app.js
  fi
  if [ "$UPDATE_INGRESS" == "true" ]; then
    echo "Restoring original ingress.yaml..."
    mv ingress.yaml.bak ingress.yaml
  fi
fi

# Optionally delete resources
read -p "Do you want to delete the deployed resources? (y/n): " delete_choice
if [ "$delete_choice" == "y" ]; then
  echo "Deleting resources..."
  kubectl delete -f backend-deployment.yaml
  kubectl delete -f frontend-deployment.yaml
  read -p "Do you want to remove the ingress projectcontour? (y/n): " contour_choice
  if [ "$contour_choice" == "y" ]; then
    kubectl delete -f contour.yaml
    kubectl delete -f ingress.yaml
  fi
  echo "Deletion complete."
else
  echo "Resources not deleted."
fi
