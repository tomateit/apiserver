const mongoose = require('mongoose');

const FeedPostSchema = new mongoose.Schema({
    //---------------------------
    user: {username: String, fullname: String, role: String},
    action: String,
    subject: String,
    time:  {type: Date, default: Date.now},

},{ capped: { size: 4096, max: 100}});

/**
 * @param {Object} user
 * @param {String} action
 * @param {String} subject
 */

FeedPostSchema.statics.log = function(user, action, subject) {
    return new FeedPost({user, action, subject}).save()
}

const FeedPost = mongoose.model('FeedPost', FeedPostSchema);

module.exports = {
    FeedPost,
};