FROM php:8.0.0-apache
ARG DEBIAN_FRONTEND=noninteractive

# Instala extensiones y dependencias necesarias
RUN apt-get update \
    && apt-get install -y sendmail libpng-dev libjpeg-dev libfreetype6-dev libzip-dev zlib1g-dev libonig-dev \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install gd mysqli mbstring zip \
    && rm -rf /var/lib/apt/lists/*

# Activa el módulo de reescritura de Apache
RUN a2enmod rewrite