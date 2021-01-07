const mongoose = require('mongoose');

const BlogpostSchema = new mongoose.Schema({
    //---------------------------
    title: {type: String, trim: true },
    published: {type: Boolean, default: false},
    description: {type: String, trim: true},
    content: String,
    author: {
        name: String,
        _id: mongoose.Schema.Types.ObjectId
    },
    figure: String,
    category: String,
    createdAt: { type: Date, default: Date.now },
    lastUpdate:{ type: Date, default: Date.now },
    publishedDate: Date,
    views: {type: Number, default:0},
    slug: String,
    styling: [String],
    pageTitle: String,
    pageDescription: String,
});

// TODO presave hooks for publishedDate, views counter!!
BlogpostSchema.pre("findOneAndUpdate", function(next) {
    let query = this;
    console.log(query._update["$set"])
    if (query._update["$set"] && query._update["$set"]["published"] === true) {
        this._update["$currentDate"]={ lastUpdate: true, publishedDate: true }
    } else {
        this._update["$currentDate"]={ lastUpdate: true }
    }
    next()
})

const Blogpost = mongoose.model('Blogpost', BlogpostSchema);

module.exports = {
    Blogpost,
};