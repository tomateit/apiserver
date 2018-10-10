const createError = require('http-errors');
let {User} = require('./../models/User');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if(!user) {
            return Promise.reject({message: "valid token, but found no user"});
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        console.log(`AUTHENTICATION FAILED: ${e}`);
        next(createError(401));
    });
};


module.exports = { authenticate };