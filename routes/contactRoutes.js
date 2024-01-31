
const express = require("express")

const router = express.Router('/')

/* On stocke les fonctions intéragissant avec 
la database dans le controlleur.
Puis on utilise ces fonctions ici */

const { getContacts, createContact, updateContact, deleteContact, getContact } = require("../controllers/contactController");

const validateToken = require("../middleware/validateTokenHandler");


/* Note : si plusieurs routes possèdent le même endpoint 
   mais utilise des méthodes différentes, alors on peut les "enchaîner".

    A la place d'écrire ces 2 lignes :

    router.route('/').get(getContacts);
    router.route('/').post(createContact);

    On peut utiliser le sucre syntaxique ci-dessous  
*/

/*On utilise le middleware validateToken pour sécuriser toutes les
routes et s'assurer que seul l'utilisateur puisse modifier les
contacts de son propre compte. */

router.use(validateToken);


router.route('/').get(validateToken, getContacts).post(validateToken, createContact);


/* Idem pour le endpoint '/:id' */

router.route('/:id').put(validateToken, updateContact).delete(validateToken, deleteContact).get(validateToken, getContact);



module.exports = router;