FROM node:12.13.1-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:12.13.1-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY index.html ./
RUN npm install --production
COPY --from=build /app/dist/ ./dist

EXPOSE 3501

ENTRYPOINT ["node", "dist/app.js"]