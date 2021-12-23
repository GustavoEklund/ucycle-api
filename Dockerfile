FROM node:16-alpine3.13
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . ./
RUN npm install
EXPOSE 8080
RUN ["chmod", "+x", "/usr/src/app/.docker/entrypoint.sh"]
