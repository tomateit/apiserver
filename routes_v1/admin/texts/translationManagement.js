const express = require("express");

const { ObjectID } = require("mongodb");
const { mongoose } = require("../db/mongoose");
const { Translation } = require("../models/Translation");
const { authenticate } = require("../middleware/authenticate");
const Router = express.Router();

Router.get("/translations", (req, res) => {
    console.log("RECIEVED GET REQUEST FOR /translations");
    Translation.find()
        .then((data) => {
            if (data) {
                res.respond(null,data);
            } else {
                res.respond({message: "No data returned while trying to find translations" });
            }
        })
        .catch((error) => {
            console.error("GET TRANSLATIONS ERROR: ",error);
            res.status(500).respond({message: "Unexpected error occured"});
        });
});

Router.post('/translations',authenticate, (req, res) => {
    console.log(`RECIEVED POST REQUEST FOR /translations: ${req.body}`);
    const newDoc = new Translation(req.body);
    newDoc.save()
        .then((data) => {
            if (data) {
                console.log(`NEW TRANSLATION SAVED: ${data}`);
                res.respond(null,data);
            } else {
                res.status(400).respond({message: "No data returned while trying to save translation" });
            }
        })
        .catch((error) => {
            console.error("ERROR POST TRANSLATION: ",error);
            res.status(error.status || 500).respond({message: "Unexpected error occured",error});
        });
});

Router.put('/translations',authenticate, (req, res) => {
    console.log(`RECIEVED PUT REQUEST FOR /translations: ${req.body}`);
    Translation.findOneAndUpdate({ _id: req.body._id }, { $set: req.body })
        .then((data) => {
            if (data) {
                console.log(`TRANSLATION UPDATED:  ${data}`);
                res.respond(null,data);
            } else {
                res.status(400).respond({message:'No data returned while trying to update translation'});
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(error.status || 500).respond({message: "FAILED TO PUT TRANSLATION",error});
        });
});

Router.delete('/translations/:_id', authenticate,(req, res) => {
    console.log(`RECIEVED DELETE REQUEST FOR /translations: ${req.params._id} `);
    Translation.findOneAndDelete({ _id: req.params._id })
        .then((data) => {
            if (data) {
                console.log(`TRANSLATION Deleted:  ${data}`);
                res.respond(null,data);
            } else {
                res.status(400).respond({message: `No data returned while trying to delete translation ${req.params._id}`});
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(error.status || 500).respond({message: `UNEXPECTED ERROR WHILE TRYING TO DELETE ${req.params._id}`, error});
        });
});

module.exports = Router;
