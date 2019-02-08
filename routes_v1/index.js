const Router = require('express').Router();

Router.use("/admin", require('./admin'));
Router.use("/public", require('./public'));
// TODO client

module.exports = Router;
