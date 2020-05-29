# GoStyle - Web service

Web service développé en Javascript/Node.JS dans le cadre d'un projet , encadré par un contexte professionnel.
Ce projet comprend :
- Un web service permettant de gérer des codes de promotions : une partie API et une partie back-office pour la gestion.
- Une application mobile, développée en React Native afin que l'utilisateur puisse scanner un QrCode de promotion.
- L'intégration continue du projet grâce à Travis

Page de login : 
![login](https://github.com/ProjetGoStyle/GoStyleWebService/blob/master/img/login.png)

Partie gestion des codes promotionnels : 
![back](https://github.com/ProjetGoStyle/GoStyleWebService/blob/master/img/codepromo.png)

Partie statistiques d'utilisations : 
![back](https://github.com/ProjetGoStyle/GoStyleWebService/blob/master/img/statistiques.png)

Partie gestion des administrateurs : 
![back](https://github.com/ProjetGoStyle/GoStyleWebService/blob/master/img/admin.png)

- L'application est sécurisée par un système de token. 
- Les mots de passes des administrateurs sont hachés dans la base de données.
- Des règles métiers sont mis en place (ex: l'utilisateur actuel du site ne peut pas se supprimer ou encore un login est unique)
