const Joi = require('joi');
const schema = {
    limit: Joi.number().integer().min(0).max(9999),
    skip: Joi.number().integer().min(0).max(9999)
};

/**
 * Express middleware sanitizes req.query 
 * forcing it (with overwrite) to fit 
 * {
 *    limit: -1<limit<10000,
 *    skip: -1<skip<10000
 * }
 * , so it can be safely used in mongoDB queries
 */

function validateQueryParams(req,res,next) {
    Joi.validate(req.query, schema, function (error, value) {
        if (error) {
            console.error(`Recieved malformed params for request ${JSON.stringify(req.query)}`)
            console.error(error)
            return res.status(400).respond({message: "Malformed query parameters. Expected -1<limit<10000, -1<skip<10000"});
        } else {
            req.query = value;
            return next()
        }
    })
}

module.exports = {validateQueryParams}