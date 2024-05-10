# Dockerfile
# Usa una imagen base con Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia el archivo package.json e instala las dependencias
COPY package*.json ./
RUN npm install

# Copia todo el código fuente
COPY . .

# Compila TypeScript a JavaScript
RUN npm run build

# Expone el puerto 3000
EXPOSE 3033

# Comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
