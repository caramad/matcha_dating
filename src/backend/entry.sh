#!/bin/bash

# check for db connection
while ! nc -z $DB_HOST $DB_PORT; do
  echo "Waiting for the database connection..."
  sleep 1
done
echo "Database is up and running!"

npm run dev