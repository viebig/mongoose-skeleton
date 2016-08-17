FROM mhart/alpine-node:6

RUN apk add --update \
    python \
    && rm -rf /var/cache/apk/*

WORKDIR /src
ADD . .
RUN npm install

EXPOSE 1212
CMD ["node", "app.js"]
