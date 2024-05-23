# Example of pass env variable from docker-compose to here, the `NODE_IMAGE_ARG` will have the value like in the .env file
# ARG NODE_IMAGE_ARG
# FROM ${NODE_IMAGE_ARG}
FROM node:18-alpine3.17
# update package to the latest version
RUN apk upgrade
# add linux-pam package to have mkhomedir_helper for easier to create home directory for `node` user
RUN apk add linux-pam
RUN mkhomedir_helper node

RUN npm install -g pnpm

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY .eslintrc.js package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install --frozen-lockfile

EXPOSE 8080
CMD [ "pnpm", "start" ]