FROM node:12.13-alpine3.10 as build

WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run test
RUN npm run build

FROM nginx
WORKDIR /app
COPY --from=build /build/dist .
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3500