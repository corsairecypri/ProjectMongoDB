const mongoose = require("mongoose")

/*Rappel : le timestamp représente le temps informatique
(le nombre de secondes depuis le 1er janvier 1970) */

/* On ajoute la variable user_id pour que chaque
contact soit associé au compte de son créateur.
Ainsi seul lui pourra ajouter, modifier ou 
supprimer ses contacts.

On ajoute la référence au modèle User pour que le modèle
Contact puisse comprendre la structure de cet objet*/

const contactSchema = mongoose.Schema({

    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    name : {
        type: String,
        required : [true, "Please add the contact name"]
    },
    email : {
        type: String,
        required : [true, "Please add the contact email"]
    },
    phone : {
        type: String,
        required : [true, "Please add the phone number"]
    }
},

{
    timestamps: true,
}

);

//On appelle ce modèle "Contact" et il doit suivre le schéma contactSchema

module.exports = mongoose.model("Contact", contactSchema)