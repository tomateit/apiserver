let {User} = require('./../models/User');

/**
 * Basic authentication middleware
 * Checks if header has token, tries to find user by token
 * Then adds user instance into req object
 * Otherwise responds 401 error
 */

let authenticate = (req, res, next) => {
    let token = req.get('x-auth');
    console.log(`REQUEST TO RESTRICED RESOURCE ${req.originalUrl} with ${token}`)
    if (!token || token == 'undefined') {
        console.error(`AUTHENTICATION FAILED: NO TOKEN`);
        return res.status(401).respond({message: "Authentication failed. Missing token."})
    } else {

        User.findByToken(token).then((user) => {
            if(!user) {
                console.error("FOUND NO USER WITH SUCH TOKEN")
                return res.status(401).respond({message: "Valid token, but found no user. You probably authenticating to wrong resource"});
            }
            console.log(`AUTHENTICATED REQUEST FROM ${user.username}`);
            req.user = user;
            req.token = token;
            next();
        }).catch((error) => {
            console.error(`AUTHENTICATION FAILED: `,error);
            res.status(401).respond({message: "Authentication failed."})
        });
    }
};


module.exports = { authenticate };