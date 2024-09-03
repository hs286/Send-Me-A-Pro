FROM node:12-alpine as react-build
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /app
COPY ./build ./

FROM nginx:alpine as nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
