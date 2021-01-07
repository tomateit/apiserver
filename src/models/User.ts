const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    //---------------------------
    username: {
        type: String,
        required: true,
        minlength: 5,
        unique: true,
    },
    fullname: String,
    role: {
        type: String,
        enum: ["USER", "ADMIN", "BOT"],
        default: "USER",
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{ token: { type: String }, exp: { type: String } }],
});

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return {username: userObject.username, fullname: userObject.fullname, role: userObject.role}
};

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const exp = "7d";
    const token = jwt.sign(
        {
            _id: user._id.toHexString(),
            username: user.username,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
        .toString();

    user.tokens = [{ exp, token }];

    return user.save().then(() => token);
};

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject(e);
        // })
        return Promise.reject(e);
    }

    return User.findOne({
        _id: decoded._id,
        "tokens.token": token,
    });
};

UserSchema.statics.findByCredentials = function (username, password) {
    const User = this;
    return User.findOne({ username })
        .then((user) => {
            if (!user) {
                return Promise.reject({ message: "Requested login user doesn't exist" });
            }
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, success) => {
                    if (err) {
                        reject(err);
                    }
                    if (success) {
                        resolve(user);
                    } else {
                        reject({ message: "Error while comparing passwords" });
                    }
                });
            });
        });
};

UserSchema.pre("save", function (next) {
    const user = this;

    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = {
    User,
};
