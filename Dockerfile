FROM node:16-alpine as build-stage
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci --silent

RUN npm install @vue/cli@4.5.15 -g
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY docker-compose/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
