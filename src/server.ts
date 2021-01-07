// Framework imports
const express = require("express");
// Utilites imports
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");

const routes_v1 = require("./routes_v1");
// --Configuration and consts
const cookieSecret = process.env.COOKIE_SECRET;

const app = express();
app.disable("x-powered-by");
app.use(cors(
    {exposedHeaders: ["x-auth"]}
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cookieSecret));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "public")))
app.use((req,res,next) => {

    /**
     * Custom response method. Wraps data into object with status and timestamp 
     * @param {Object} error - Error info, will be spread(!) and sent with success: false
     * @param {any} data - if no error, will be send as subfield, with success: true
     */
    function respond  (error, data = null) {
        if (error) {
            return res.send({sucess: false, timestamp: Date.now(), ...error});
        } else {
            return res.send({success: true, timestamp: Date.now(), data});
        }
    }
    res.respond = respond;
    next()
})

app.use("/v1", routes_v1);

app.get("/", (req, res) => {
    console.log("API root invoked");
    res.respond(null, { title: "This is API SERVER", text: "You've just invoked root, good boy :)" });
});

// If no page found
app.use("*",(req, res, next) => {
    res.sendStatus(404)
});

app.use((error, req, res, next) => {
    // TODO Catch 404 in other way
    if (error.message == 'Not Found') {
        return res.sendStatus(404)
    }
    console.error(">>>>>>>> THIS ERROR WAS NOT CAUGHT <<<<<<<<<<<<", error)

    res.status(error.status || 500).respond({message: "GLOBAL SERVER ERROR"});
});

module.exports = app;