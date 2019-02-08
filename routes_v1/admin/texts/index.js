const express = require('express');
let Router = express.Router();

const {ObjectID} = require('mongodb');
const { Text } = require('../../../models/Text');

Router.get('/', (req, res)=>{
    Text.find().then(data => {
        if (data) {
            res.respond(null,data);
        } else {
            res.status(400).respond({message: `No data returned while trying to find texts`});
        }
    }).catch( (error) => {
            console.error(error)
            res.status(e.status || 400).respond({message: "Unexpected error", error})
            }
        );
});

Router.post('/', (req, res)=>{
    let newDoc = new Text(req.body);
    newDoc.save()
        .then((data) => {
            if (data) {
                console.log("NEW TEXT SAVED:  ". data);
                res.respond(null,data);
            } else {
                res.respond({message: `No data returned while trying to save translation`});
            }
        })
        .catch( (error) => {
            console.error(error)
            res.status(error.status || 400).respond({messsage: "Unexpected error occured",error})
            }
        );
});

Router.put('/:_id', (req, res)=>{
    if (!ObjectID.isValid(req.params._id)) {
        return res.status(400).respond({message: "Invalid or missing ObjectID", error: "EOBJECTID"}); 
    }
    Text.findOneAndUpdate({_id: req.body._id}, {$set: req.body})
        .then((data) => {
            if (data) {
                console.log("TRANSLATION UPDATED:  ". data);
                res.respond(null,data);
            } else {
                res.respond({message: `No data returned while trying to update translation`});
            }
        })
        .catch((error) => {
            console.error("TRANSLATION UPDATE ERROR: ",error)
            res.status(e.status || 400).respond({message: "TRANSLATION PUT REQUEST caused unexpected error", error})
            }
        );
});

Router.delete('/:_id', (req, res)=>{
    if (!ObjectID.isValid(req.params._id)) {
        return res.status(400).respond({message: "Invalid ObjectID", error: "EOBJECTID"}); 
    }
    Text.findOneAndDelete({_id: req.params._id})
        .then((data) => {
            if (data) {
                console.log("TRANSLATION Deleted:  ". data);
                res.respond(null, data);
            } else {
                res.respond({message: `No data returned while trying to delete translation ${req.params._id}`});
            }
        })
        .catch( error => {
            console.error(error)
            res.status(e.status || 400).respond({message: `DELETE ${req.params._id} translation caused unexpected error`, error})
            }
        );
});

module.exports = Router;