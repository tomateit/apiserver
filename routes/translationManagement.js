const express = require('express');
let Router = express.Router();

const {mongoose} = require('../db/mongoose');
const {ObjectID} = require('mongodb');
const { Translation } = require('../models/Translation');

Router.get('/translations', (req, res)=>{
    console.log("RECIEVED GET REQUEST FOR /translations");
    Translation.find().then(data => {
        if (data) {
            res.send(data);
        } else {
            return Promise.reject({status: 404, message: `No data returned while trying to find translations`});
        }
    }).catch( (e) => {
            console.log(e)
            res.status(e.status || 400).send(e)
            }
        );
});

Router.post('/translations', (req, res)=>{
    console.log("RECIEVED POST REQUEST FOR /translations:  ",req.body);
    let newDoc = new Translation(req.body);
    newDoc.save()
        .then((data) => {
            if (data) {
                console.log("NEW TRANSLATION SAVED:  ". data);
                res.send(data);
            } else {
                return Promise.reject({status: 400, message: `No data returned while trying to save translation`});
            }
        })
        .catch( (e) => {
            console.log(e)
            res.status(e.status || 400).send(e)
            }
        );
});

Router.put('/translations', (req, res)=>{
    console.log("RECIEVED PUT REQUEST FOR /translations:  ",req.body);
    Translation.findOneAndUpdate({_id: req.body._id}, {$set: req.body})
        .then((data) => {
            if (data) {
                console.log("TRANSLATION UPDATED:  ". data);
                res.send(data);
            } else {
                return Promise.reject({status: 404, message: `No data returned while trying to update translation`});
            }
        })
        .catch((e) => {
            console.log(e)
            res.status(e.status || 400).send(e)
            }
        );
});

Router.delete('/translations/:_id', (req, res)=>{
    console.log(`RECIEVED DELETE REQUEST FOR /translations: ${req.params._id} `);
    Translation.findOneAndDelete({_id: req.params._id})
        .then((data) => {
            if (data) {
                console.log("TRANSLATION Deleted:  ". data);
                res.send(data);
            } else {
                return Promise.reject({status: 404, message: `No data returned while trying to delete translation`});
            }
        })
        .catch( (e) => {
            console.log(e)
            res.status(e.status || 400).send(e)
            }
        );
});

module.exports = Router;