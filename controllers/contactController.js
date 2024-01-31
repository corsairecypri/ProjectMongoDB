// Ce module permet de gérer les promesses des fonctions
// asynchrones avec express (ceci pour permettre les
//échanges avec la database mongoDB )

const asyncHandler = require("express-async-handler")

//Le modèle de contact permet d'intéragir avec la database

const Contact = require("../models/contactModel")

//@desc Get all contacts
//@route GET /api/contacts
//@access private

/* Le controlleur gère la partie logique
(échange avec la base de donnée) */


const getContacts = asyncHandler(async (req, res) => {

    //La méthode find() permet de recevoir une réponse de la database.
    //Ensuite sa réponse est affichée dans le res.json avec la variable contacts

    /*Dans le find() on recherche les données possédant l'user_id
    de l'utilisateur pour s'assurer qu'il ne peut accéder qu'à des 
    contacts de son compte */

    const contacts = await Contact.find({ user_id: req.user.id})

    res.status(200).json(contacts)
});

//@desc Create new contact
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async (req, res) => {

    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory !")
    }

    /*Si le req.body possède toutes les infos, on crée un contact */

    const contact = await Contact.create({
        name,
        email, 
        phone,
        user_id : req.user.id
    });

    res.status(201).json(contact)
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req, res) => {

    //On vérifie d'abord l'existence du contact
    const contact = await Contact.findById(req.params.id);

    if(!contact) {
        res.status(404);
        throw Error("Contact not found");
    }


    /*On vérifie que le contact appartient bien à l'utilisateur.
    Si ce n'est pas le cas, on envoie un message d'erreur. */

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts")
    }


    //Si on le trouve, on le met à jour

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true}
    );

    res.status(200).json(updatedContact)
})

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (req, res) => {

    const contact = await Contact.findById(req.params.id);

    if(!contact) {
        res.status(404);
        throw Error("Contact not found");
    }


    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to delete other user contacts")
    }

    //On enlève le contact
    await Contact.deleteOne({ _id: req.params.id });

    res.status(200).json(contact)
})

//@desc Get contact
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async (req, res) => {

    const contact = await Contact.findById(req.params.id);

    if(!contact) {
        res.status(404);
        throw Error("Contact not found");
    }

    res.status(200).json(contact)
})

module.exports = { getContacts, createContact, updateContact, deleteContact, getContact }