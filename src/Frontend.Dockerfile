FROM node:12.13-alpine3.10 as build
###########
# Common
###########
WORKDIR /app/common
COPY common/package.json ./
COPY common/package-lock.json ./
RUN npm install
COPY common .
RUN npm run test
RUN npm run build
###########
# Frontend
###########
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run test
RUN npm run build
###########
# Prod
###########
FROM nginx
WORKDIR /app
COPY --from=build /app/frontend/dist .
COPY frontend/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3500