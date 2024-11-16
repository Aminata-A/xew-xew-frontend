# Étape 1 : Construction de l'application Ionic
FROM node:18 as build

# Définir le répertoire de travail
WORKDIR /app

# Installer la dernière version de npm
RUN npm install -g npm@latest

# Copier les fichiers nécessaires pour l'installation
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet
COPY . .

# Construire l'application Ionic pour la production
RUN npm install -g @ionic/cli
RUN ionic build --prod

# Étape 2 : Serveur léger avec Nginx pour déployer l'application
FROM nginx:stable-alpine

# Copier les fichiers de build Ionic vers Nginx
COPY --from=build /app/www/ /usr/share/nginx/html/

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
