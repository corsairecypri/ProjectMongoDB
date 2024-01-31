
/*Pour accéder à la route privée userInfos,
il faut utiliser un access token en utilisant
la route login.
Il faut mettre cet access token dans la partie 
Authentifation -> Bearer de Postman.

Il faut également ajouter dans les headers de Postman
un header Authorization avec comme valeur
Bearer, suivi de l'access token qui fonctionne à l'instant t.
(les 2 sont séparés par un espace)*/

const asyncHandler = require("express-async-handler")

const jwt = require("jsonwebtoken")


const validateToken = asyncHandler(async(req, res, next) => {
    let token;

    /*On cherche dans les headers de Postman l'header Authorization 
    (on rend également le A majuscule facultatif) */

    let authHeader = req.headers.Authorization || req.headers.authorization;

    /*On vérifie si la valeur du header Authorization commence par Bearer
     
    Puis pour donner à la variable token une valeur, on coupe authHeader
    en 2 avec l'espace, et on prend le second morceau
    */

    if(authHeader && authHeader.startsWith("Bearer")) {

        token = authHeader.split(" ")[1]

        /*On vérifie la validité du token avec jwt.verify.
        Elle prend comme 1er paramètre l'access token, en 
        2ème param une variable d'environnement et en 3ème
        paramètre une fonction en callback qui vérifie la présence d'erreurs*/

        /*Si le token est accepté, on rend la variable user de la requête
        égale à la variable user décodée dans le token envoyé par Postman.
        Et on n'oublie pas le next() */

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                res.status(401);
                throw new Error("User is not authorized")
            }

            req.user = decoded.user;

            next();
        })

        if(!token) {
            res.status(401);
            throw new Error("User is not authorized or token is missing")
        }
    }
})

module.exports = validateToken;