const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
    //---------------------------
    username: {
        type: String,
        required: true,
        minlength: 5,
        unique: true
    },
    fullname: String,
    role: {
        type: String,
        default: "USER"
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{token: {type: String}, exp: {type: String} }]
    
});

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['username', 'role', 'fullname'])
}

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let exp = '1d';
    let token = jwt.sign(
        {
            _id: user._id.toHexString(), 
            username: user.username, 
            role: user.role
        }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' })
            .toString();

    user.tokens = [{exp, token}];

    return user.save().then(()=> token)
}

UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject(e);
        // })
        return Promise.reject(e);
    }

    return User.findOne({
        "_id": decoded._id,
        "tokens.token":token 
    })
}

UserSchema.statics.findByCredentials = function(username, password) {
    let User = this;
    return User.findOne({username})
            .then((user) => {
                if (!user) {
                    return Promise.reject({status: 400, message: "Requested login user doesn't exist"})
                }
                return new Promise((resolve, reject)=> {
                    bcrypt.compare(password, user.password, (err, success) => {
                        if (err) {
                            reject({status: 400, message: "Error while comparing passwords"})
                        }
                        if (success) {
                            resolve(user);
                        } else {
                            reject({status: 400, message: "INVALID PASSWORD"})
                        }
                    })
                })
            })
}

UserSchema.pre('save', function (next){
    let user = this;

    if (user.isModified('password')){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password=hash;
                next()
            });
        });
    } else {
        next()
    }
})


let User = mongoose.model('User', UserSchema);


module.exports = {
    User
};