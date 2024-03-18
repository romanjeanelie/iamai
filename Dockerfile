FROM node:20.3.0-alpine3.17

RUN mkdir -p /iamai-main
WORKDIR /iamai-main
COPY  . .
RUN npm install
RUN npm install -g http-server
# RUN npm run build
RUN npm run build -- --mode dev
EXPOSE 8080
WORKDIR /iamai-main/dist
CMD [ "http-server"]
