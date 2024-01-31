const express = require("express");
const errorHandler = require("./middleware/errorhandler");
const connectDb = require("./config/dbConnection");

const dotenv = require("dotenv").config();

//Cette fonction permet la connection à la base de données.

connectDb();

const app = express();


const port = process.env.PORT || 5000;


app.use(express.json());

/* Toutes les routes commençant par /api/contacts chercheront la
suite de la route dans le fichier suivant */

app.use("/api/contacts", require("./routes/contactRoutes"))

//On crée des routes pour les utilisateurs (gestion des comptes)

app.use("/api/users", require("./routes/userRoutes"))

app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});

//Lien du tutoriel : https://www.youtube.com/watch?v=H9M02of22z4

/*
Si j'ai besoin de réviser MongoDB, c'est à partir de 34:21

Pour la connexion à la base de données, voir de 37:00 à 42:22
*/

//J'ai installé le produit MongoDB Vs-Code pour permettre la
//connexion à la base de données avec VS-Code.


/* Pour utiliser ce programme, vous avez besoin de 3 variables
d'environnement dans votre .env :

le PORT 
la CONNECTION_STRING de votre database MongoDB
et le ACCESS_TOKEN_SECRET
*/