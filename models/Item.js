const mongoose = require('mongoose');

let ItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    amount: Number,
    date_of_manufacture: Date 
    
}, {strict: true});

// mySchema.index({field1: 1, field2: 1}, {unique: true});


let Item = mongoose.model('Item', ItemSchema);

module.exports = {
    Item
};

