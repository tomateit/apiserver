const express = require('express');
const Router = express.Router();
const path = require("path");


Router.use("/blog", require('./blog'));
Router.use("/texts", require('./texts'));
Router.use(express.static(path.join(__dirname,"..","..", "public")))

module.exports = Router;