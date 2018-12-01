FROM node:10-slim

COPY . /app
RUN cd /app && \
    yarn && \
    yarn run build && \
    rm -rf node_modules && \
    yarn install --production

WORKDIR /app

CMD ["node", "/app/dist/main.js"]
