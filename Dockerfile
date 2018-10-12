from nginx:latest

RUN rm /etc/nginx/conf.d/*
ADD ./nginx_sherlock.conf /etc/nginx/conf.d

ADD js /var/www/sherlock/js
ADD css /var/www/sherlock/css
ADD media /var/www/sherlock/media
ADD node_modules /var/www/sherlock/node_modules
ADD index.html /var/www/sherlock

ADD models /models

EXPOSE 80
