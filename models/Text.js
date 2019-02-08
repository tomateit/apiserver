const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["article", "translation"]
    },
    name: String,
    lang: String,
    body: {
        type: Object,
    },
});

const Text = mongoose.model('Text', TextSchema);

module.exports = { Text };
