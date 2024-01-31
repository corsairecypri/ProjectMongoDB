const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();


router.post("/register", registerUser)

router.post("/login", loginUser)


/*Cette route privée utilise un middleware de vérification
de l'access token avant d'authoriser l'accès aux données de
l'utilisateur. Si cet access token est valide, il authorise
l'accès */

router.get("/current", validateToken, currentUser)

module.exports = router;