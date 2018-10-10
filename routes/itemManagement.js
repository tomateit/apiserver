const express = require('express');
let Router = express.Router();

const {mongoose} = require('../db/mongoose');
const {ObjectID} = require('mongodb');
const { Item } = require('../models/Item');

Router.post('/items', (req, res)=>{
    console.log(`RECIEVED POST REQUEST TO /items WITH PAYLOAD:  `,req.body);
    let newDoc = new Item(req.body);
    newDoc.save()
        .then((data) => {
            if (data) {
                console.log(`SAVING DATA FROM POST REQUEST:  `, data.ticker);
                res.send(data);
            } else {
                return Promise.reject({message:`ATTEMPT TO SAVE ITEM ${req.body} RETURNED NO DATA`, status: 400});
            }
        })
        .catch((e) => {
            console.log(e);
            res.status(e.status || 400).send(e);
            }
        );
});



Router.put('/items/:id', (req, res) => {
    console.log(`RECIEVED PUT REQUEST TO /items/${req.params.id}:  `);
    if (!ObjectID.isValid(req.params.id)) {
        console.log("400 PUT BY ID DUE TO INVALID ID");
        res.sendStatus(400);
        return ; 
    }
    Item.findByIdAndUpdate(req.params.id, {$set:req.body})
        .then((data) => {
            if (data) {
                console.log("PUT BY ID SUCCESSFUL FOR:  ", data.name);
                res.send(data);
            } else {
                return Promise
                    .reject({message: `404 PUT BY ID ${req.params.id}`, status: 404}) ;
            }
        })
        .catch( (e) => {
            console.error(e)
            res.status(e.status || 400).send(e.message);
            }
        );
});


Router.delete('/items/:id', (req, res) => {
    console.log(`RECIEVED DELETE REQUEST TO /items/${req.params.id}  `);
    Item.findOneAndDelete({_id: req.params.id}).then((data)=>{
        if (data) {
            console.log("ITEM DELETED: ", data)
            res.send(data);
        } else {
            return Promise.reject({status: 404, message: `No item found to delete, searched for: ${req.params.id}`});
        }     
    }).catch(e=> {
        console.log(e);
        res.status(e.status || 400).send(e);
    })
    // res.send("this function is currently disabled");
});


module.exports = Router;