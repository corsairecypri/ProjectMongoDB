
const asyncHandler = require("express-async-handler")

const User = require("../models/userModel")

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler( async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory")
    }

    /* Avec la variable userAvailable, on interagit
    avec les users dans la database et on utilise
    la fonction findOne pour vérifier si l'adresse
    mail de l'utilisateur à inscrire est déjà présente
    ou non.
    Si son adresse est déjà présente, on renvoie un message d'erreur*/

    const userAvailable = await User.findOne( {email} )

    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered")
    }

    /* Si l'utilisateur est accepté, on hashe son mdp
    avec le module bcrypt. On réalise 10 cycles de hashage */

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    
    //On crée un nouvel utilisateur

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    })

    console.log(`User created ${user}`)

    /*Si l'utilisateur est créé avec succès, on affiche son id et
    son adresse mail (mais pas le hash de son mdp pour des raisons de 
    sécurité) */

    if (user) {
        res.status(201).json({ id: user.id, email: user.email})
    } else {
        res.status(400)
        throw new Error("User data is not valid")
    }

    res.json({ message: "Register the user"})
});

//@desc Login a user
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler( async (req, res) => {

    const {email, password} = req.body;

    /* On vérifie qu'il ne manque aucune information
    essentielle, puis on vérifie la présence de l'utilisateur
    dans la database */

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory")
    }

    const user = await User.findOne({ email });

    /* Si l'utilisateur existe, on vérifie que le mdp qu'il a donné
    est le même que celui présent dans la base de données 
    (cette vérification prend du temps, d'où le await) */

    if (user && (await bcrypt.compare(password, user.password))) {

        //On crée un access token avec les données de l'utilisateur,
        //auquel on ajoute un access_token_secret stocké dans le .env
        //On donne ensuite une durée de vie de 1 min pour cet access 
        //token

        const accessToken = jwt.sign(
        {
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"})



        res.status(200).json({ accessToken });
    } else {
        res.status(401)
        throw new Error("Email or password is not valid")
    }

});

//@desc Current user info
//@route POST /api/users/current
//@access private (seul l'utilisateur peut accéder à ses infos persos)

const currentUser = asyncHandler( async (req, res) => {

    //On renvoie simplement les données de l'utilisateur
    //telles qu'elles sont traitées par le middleware
    //validateTokenHandler

    res.json(req.user)
});

module.exports = { registerUser, loginUser, currentUser }