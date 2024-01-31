const {constants} = require("../constants")



/* Par défaut Postman affiche l'erreur
avec un format html.

On souhaite créer un middleware qui transforme
ce code HTML en un objet JSON. */

const errorHandler = (err, req, res, next) => {

    /* Si la réponse possède un status code, on l'affiche.
    Dans le cas contraire, le status code par défaut est 500
    (problème de connexion) */

    statusCode = res.statusCode ? res.statusCode : 500;

    /* Le stackTrace permet de faciliter le débuggage.
    Il affiche ce qui se passe dans la pile durant l'erreur
    et de voir où elle se trouve */

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ 
                title: "Validation Failed", 
                message : err.message, 
                stackTrace: err.stack
            })
            break;

        case constants.NOT_FOUND:
            res.json({ 
                title: "Not Found", 
                message : err.message, 
                stackTrace: err.stack
            })
        
        case constants.UNAUTHORIZED:
            res.json({ 
                title: "Unauthorized", 
                message : err.message, 
                stackTrace: err.stack
            })
        
        case constants.FORBIDDEN:
            res.json({ 
                title: "Forbidden", 
                message : err.message, 
                stackTrace: err.stack
            })
        
        case constants.SERVER_ERROR:
            res.json({ 
                title: "Server error", 
                message : err.message, 
                stackTrace: err.stack
            })
            
        default:
            console.log("No Error, All good !")
            break;
    }



    
    
};

module.exports = errorHandler;

