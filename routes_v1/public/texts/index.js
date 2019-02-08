const express = require('express');
let Router = express.Router();
const { Text } = require('../../../models/Text');


Router.get('/', (req, res) => {
    // console.log(`Requested locals for lang ${req.params.lang}`);
    Text.findOne({type: req.query.type, lang: req.query.lang}).then((data) => {
        if (data) {
            res.respond(null, data.body);
        } else {
            res.respond(null);
        }
    });
});

module.exports = Router;