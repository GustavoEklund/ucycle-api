FROM node:16-alpine3.13
RUN apk --no-cache add curl
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . ./
RUN npm install
EXPOSE 3000
EXPOSE 9222
EXPOSE 9229
RUN ["chmod", "+x", "/usr/src/app/.docker/entrypoint.sh"]
