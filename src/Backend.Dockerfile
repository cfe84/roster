FROM node:12.13.1-alpine as build
###########
# Common
###########
WORKDIR /app/common
COPY common/package*.json ./
RUN npm install
COPY common .
# RUN npm run test
RUN npm run build
RUN npm run cp
###########
# Backend
###########
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .
RUN npm run test
RUN npm run build
###########
# Prod
###########
FROM node:12.13.1-alpine
WORKDIR /app
COPY backend/package.json ./
COPY backend/package-lock.json ./
COPY backend/index.html ./
RUN npm install --production
COPY --from=build /app/backend/dist/src ./dist/src
COPY --from=build /app/backend/dist/lib ./dist/lib

EXPOSE 3501

ENTRYPOINT node dist/src/app.js