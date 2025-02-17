FROM nginx

# Copy files
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./entry.sh /entry.sh

# Ensure the script is executable
RUN chmod +x /entry.sh

EXPOSE 80

# Use absolute path to execute the script
ENTRYPOINT ["/entry.sh"]
