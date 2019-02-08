const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    //---------------------------
    title: String,
    href: {type: String},
    description: String,
});

const Banner = mongoose.model('Banner', BannerSchema);

module.exports = {
    Banner,
};
