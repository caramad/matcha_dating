#!/bin/bash

# check existence of $DB_HOST and $DB_PORT
if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]; then
  echo "Please provide the database host and port!"
  exit 1
fi

# check for db connection
while ! nc -z $DB_HOST $DB_PORT; do
  echo "Waiting for the database connection..."
  sleep 1
done
echo "Database is up and running!"

npm run dev