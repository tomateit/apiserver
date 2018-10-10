const express = require('express');
let Router = express.Router();

const {ObjectID} = require('mongodb');
const {mongoose} = require('../db/mongoose');
const { Item } = require('../models/Item');
const { Translation } = require('../models/Translation');

//-----TODO:---------
// Use LRU (lru-cache) to cache 
//---
//---------------------------

Router.get('/items', (req, res)=> {
    if (req.header('x-auth')) {
        Item.find().then((data)=>{
            console.log(`Requested items, ${data.length} are sent`);
            res.send(data);
        })
    } else {
        Item.find({published: true}).then((data)=>{
            console.log(`Requested coins, ${data.length} items sent`);
            res.send(data);
        })
    }
});

//-------------Individual sending --------------------
Router.get('/items/:slug', (req, res) => {
    Coin.findOne({slug: req.params.slug}).then((data)=>{
        if (data) {
            res.send(data);
        } else {
            res.sendStatus(404);
        }
    }).catch((error) => {
        //TODO: error handling
    });
});

//-------------------------------------------------------------
//------------------LOCALS------------------------
//-------------------------------------------------------------

Router.get('/locals/:lang', function (req, res) {
    console.log("Requested locals for lang", req.params.lang);
    Translation.findOne({"lang":req.params.lang}).then((data) => {
        if (data) {
            res.send(data.body);
        } else {   
            res.sendStatus(404);
        }
    })
});

module.exports = Router;