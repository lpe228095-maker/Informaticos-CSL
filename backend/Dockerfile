# Imagen base oficial de Node.js versión alpine (ligera y optimizada)
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar SOLO los package.json para aprovechar la cache de Docker
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install

# Copiar el resto del código del backend
COPY . .

# Exponer puerto de la API
EXPOSE 3000

# Carga los datos de contexto en OpenSearch
ENTRYPOINT ["sh", "-c", "node bin/context.js && exec \"$@\"", "--"]

# CMD queda intacto, define el arranque del servidor
CMD ["node", "src/server.js"]
