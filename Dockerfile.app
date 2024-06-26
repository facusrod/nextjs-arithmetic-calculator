# Usa una imagen base de Node.js
FROM node:22

# Establece el directorio de trabajo en la imagen
WORKDIR /usr/src/app

# Copia los archivos de la aplicación a la imagen
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación a la imagen
COPY . .

# Construye la aplicación
RUN npm run build

# Expone el puerto que la aplicación usará
EXPOSE 3000

# Define el comando por defecto para ejecutar la aplicación
CMD ["npm", "run", "start"]