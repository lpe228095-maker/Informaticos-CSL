# Imagen base oficial de Nginx version alpine
FROM nginx:alpine

# Eliminar los archivos por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar todos los archivos estáticos del repo al directorio de Nginx
COPY public/ /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]
