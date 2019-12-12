FROM node:12.13.1-alpine as build
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
COPY --from=build /app/backend/dist/src ./dist
COPY --from=build /app/backend/dist/common ./dist

EXPOSE 3501

ENTRYPOINT node dist/app.js