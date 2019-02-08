const express = require('express')
const path = require("path")
const Router = express.Router();

Router.use("/blog", require('./blog'));
Router.use("/feed", require('./feed'));
Router.use("/texts", require('./texts'));
Router.use("/users", require('./users'));
Router.use(express.static(path.join(__dirname,"..","..", "public")))

module.exports = Router;