FROM node:16-alpine3.13
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . ./
RUN npm install
EXPOSE 3000
RUN ["chmod", "+x", "/usr/src/app/.docker/entrypoint.sh"]
