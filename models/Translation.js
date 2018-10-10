const mongoose = require('mongoose');

let TranslationSchema = new mongoose.Schema({
    //---------------------------
    type: {
        type: String,
    },
    lang: String,
    body: {
        type: Object
    } 
    
});


let Translation = mongoose.model('Translation', TranslationSchema);


module.exports = {
    Translation
};