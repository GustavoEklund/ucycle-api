FROM scireum/s3-ninja:latest

COPY ./entrypoint.sh /usr/src/app/docker/aws-s3/entrypoint.sh
USER root
RUN ["chmod", "+x", "/usr/src/app/docker/aws-s3/entrypoint.sh"]
USER sirius

EXPOSE 9444

ENTRYPOINT ["sh", "/usr/src/app/docker/aws-s3/entrypoint.sh"]
