const express = require('express');

const { authenticate } = require('../../../middleware/authenticate');
const { FeedPost } = require('../../../models/FeedPost');

const Router = express.Router();

Router.get('/',authenticate, (req, res) => {
    
        FeedPost.find({}, {_id: 0, __v: 0})
            .then((posts) => {
                if (posts) {
                    console.log(`SENDING ${posts.length} posts FROM GET REQUEST /feed `);
                    res.respond(null,posts);
                } else {
                    res.status(500).respond({ message: 'ATTEMPT TO GET USERS RETURNED NO posts' });
                }
            })
            .catch((error) => {
                console.error(error)
                res.status(error.status || 500).respond({message: "/feed request caused unexpected error", error})
            });
    
});


module.exports = Router;