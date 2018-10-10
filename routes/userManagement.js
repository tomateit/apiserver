const express = require('express');
let Router = express.Router();
const { authenticate }  = require('../middleware/authenticate');
const path = require('path');

const {ObjectID} = require('mongodb');
const {mongoose} = require('../db/mongoose');
const { User } = require('../models/User');
const _ = require('lodash');



Router.get('/users',authenticate,  (req, res)=> {
    if (req.user.role !== "ADMIN") {
        res.sendStatus(405);
    } else {
        User.find().then((users) => {
            if (users) {
                console.log(`SENDING ${users.length} users FROM GET REQUEST /users `);
                res.send(users);
            } else {
                return Promise.reject({message:`ATTEMPT TO GET USERS RETURNED NO users`, status: 400});
            }
        })
        .catch((e) => {
            console.log(e)
            res.status(e.status || 400).send(e)
            }
        );
    }    
});

Router.post('/users',authenticate,  (req, res)=> {
    if (req.user.role !== "ADMIN") {
        res.sendStatus(405);
    } else {
        let user = new User(_.pick(req.body, ["username", "password"]));

        user.save()
            .then((data)=>{
                console.log(`SAVED NEW USER: ${data}`);
                return user.generateAuthToken();
            })
            .then((token) => {
                res.header('x-auth', token).send(user)
            })
            .catch((e) => {
                console.log(`ERROR WHILE SAVING NEW USER: ${e}`);
                res.status(400).send(e)
            })
    }
});

Router.post('/users/login', (req, res)=> {
    let body = _.pick(req.body, ["username", "password"])
    User.findByCredentials(body.username, body.password)
        .then((user)=> {
            if (!user) {
                return Promise.reject()
            }

            return user.generateAuthToken().then((token)=> {
                res.header('x-auth', token).send(user);
                })
        })
        .catch((e)=> {
            console.log(`LOGIN FAILED: ${e.message}`)
            res.sendStatus(e.status);
        })
})

Router.get('/users/me', authenticate,(req, res)=> {
    res.send(req.user);
});



module.exports = Router;