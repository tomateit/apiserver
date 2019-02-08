const express = require('express');
const Router = express.Router();
const { validateQueryParams } = require('../../../middleware/validateQueryParams');
const { ObjectID } = require('mongodb');
const { Blogpost } = require('../../../models/Blogpost');

Router.get('/',validateQueryParams, (req, res) => {
    console.log(`RECIEVED GET REQUEST FOR ${req.url}`);
    Blogpost.find({published: true}, {title:1, description: 1, publishedDate:1, views: 1, slug: 1,figure:1, category: 1,styling:1, _id: 0}, req.query)
        .sort({publishedDate: -1})
        .then((data) => {
            res.respond(null, data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).respond({message: " /blog request failed. Please try later, or contact tech support"});
        });
});

// TODO make query-string based requests
Router.get('/category/:category',validateQueryParams, (req, res) => {
    console.log(`RECIEVED GET REQUEST FOR ${req.url}`);
    Blogpost.find({published: true, category: req.params.category}, {title:1, description: 1, publishedDate:1, views: 1, slug: 1,figure:1, category: 1,styling:1, _id: 0}, req.query)
        .sort({publishedDate: -1})
        .then((data) => {
            res.respond(null, data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).respond({message: `${req.url} request caused unexpected error`});
        });
});

Router.get('/:slug', (req, res) => {
    console.log(`RECIEVED GET REQUEST FOR ${req.url}`);
    let viewsIncrement = 1
    if (req.query.seen) {
        viewsIncrement=0
    }
    Blogpost.findOneAndUpdate({published: true, slug: req.params.slug }, {$inc: {views: viewsIncrement}}, {projection: {title:1, description: 1, views: 1, content: 1,category: 1, publishedDate:1, styling:1, pageDescription: 1, pageTitle: 1}})
        .then((data) => {
            if(!data) {
                return res.status(404).respond({message: `Post ${req.params.slug} not found, please check your link`})
            }
            res.respond(null,data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).respond({message: `Unexpected error while requesting for ${req.url}`});
        });
});


module.exports = Router;