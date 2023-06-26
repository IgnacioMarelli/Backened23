FROM node as dependencies

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM node as build

WORKDIR /app

COPY --from=dependencies /app ./

COPY . .

RUN npm run build

FROM node as run

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app ./
