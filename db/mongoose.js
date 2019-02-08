const mongoose = require('mongoose');

// MONGODB_URI can be set by .env file
mongoose.Promise = global.Promise;
mongoose
    .connect(process.env.MONGODB_URI,  { useNewUrlParser: true })
    .catch((reason) => {
        console.error("MONGOOSE CONNECTION ERROR:  "  + reason)
    });
console.log('Mongoose connected to db at: ',process.env.MONGODB_URI);

module.exports = {
    mongoose
};

