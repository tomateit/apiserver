const express = require('express');
const jwt = require("jsonwebtoken");

const { authenticate } = require('../../../middleware/authenticate');
const { User } = require('../../../models/User');
const { FeedPost } = require('../../../models/FeedPost');

const Router = express.Router();

Router.get('/', authenticate, (req, res) => {
    if (req.user.role !== 'ADMIN') {
        res.status(405).respond({message: "You are not allowed to do this"});
    } else {
        User.find()
            .then((users) => {
                if (users) {
                    console.log(`SENDING ${users.length} users FROM GET REQUEST /users `);
                    res.respond(null,users);
                } else {
                    res.status(500).respond({ message: 'ATTEMPT TO GET USERS RETURNED NO users' });
                }
            })
            .catch((error) => {
                console.error(error)
                res.status(error.status || 500).respond({message: "/users request caused unexpected error", error})
            });
    }
});

// Router.post('/users', authenticate, (req, res) => {
    
//     if (req.user.role !== 'ADMIN') {
//         res.sendStatus(405);
//     } else {
//         const user = new User(_.pick(req.body, ['username', 'password']));

//         user.save()
//             .then((data) => {
//                 console.log(`SAVED NEW USER: ${data}`);
//                 return user.generateAuthToken();
//             })
//             .then((token) => {
//                 res.header('x-auth', token).send(user);
//             })
//             .catch((e) => {
//                 console.log(`ERROR WHILE SAVING NEW USER: ${e}`);
//                 res.status(400).send(e);
//             });
//     }
// });


Router.post('/',authenticate, (req, res) => {
        if (!req.user.role === "ADMIN") {
            return res.respond({message: `YOU DON'T HAVE ENOUGH PERMISSIONS! MIND YOUR PLACE, ${req.user.role}`})
        }
        const user = new User({username: req.body.username, fullname: req.body.fullname, role: req.body.role});
        user.save()
            .then((data) => {
                //! FIXIT: Don't log sensetive data
                console.log(`SAVED NEW USER: ${data}`);
                return user.generateAuthToken();
            })
            .then((token) => {
                res.set('x-auth', token).respond(null,user);
            })
            .catch((error) => {
                console.error(`ERROR WHILE SAVING NEW USER: ${error}`);
                res.status(500).respond({message: "ERROR WHILE SAVING USER", error});
            });
    
});



Router.post('/login', (req, res)=> {
    const body = {username: req.body.username, password: req.body.password};
    User.findByCredentials(body.username, body.password)
        .then((user) => {
            console.log(`AUTHENTICATED ${user.username}, generating token...`)
            user.generateAuthToken().then(token => {
                console.log("TOKEN IS READY TO BE SENT. Welcome user!")
                // Token is double decoded because we need iat and exp fields
                res.set("x-auth", token).respond(null,Object.assign({}, user.toJSON(),jwt.decode(token,{json: true})));
                FeedPost.log(user, "authenticated")
            })
        }, (error) => {
            console.error(`LOGIN FAILED: `,error);
            res.status(400).respond({message:"No user with such credentials"});
        })
        .catch((error) => {
            console.error("LOGIN PROCESS EXCEPTION: ",error);
            res.status(500).respond({message: "LOGIN EXCEPTION"});
        });
});

Router.get('/me', authenticate, (req, res) => {
    res.respond(null,Object.assign({}, req.user.toJSON(),jwt.decode(req.token,{json: true})));
});

module.exports = Router;
