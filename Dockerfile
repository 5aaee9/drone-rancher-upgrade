FROM node:10-slim as builder

COPY . /app
RUN cd /app && \
    yarn && \
    yarn run build

FROM node:10-slim
COPY --from=builder /app/dist /app
WORKDIR /app

CMD ["node", "/app/main.js"]
