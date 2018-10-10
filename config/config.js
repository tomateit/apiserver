let env = process.env.NODE_ENV || 'development';


console.log("ENTER TO CONFIG.JS.....")

if (env === 'development'){
    //Import of private development keys
    //such as process.env.MONGODB_URI 
    require('./keys.js');

    process.env.PORT = 3010;
    process.env.API_DOMAIN = process.env.API_DOMAIN || `http://localhost:${process.env.PORT}`,
    process.env.JWT_SECRET = "ConspiracySupremacyFallacy";
    process.env.TOKEN_LIFESPAN = 3600*24*7
    process.env.COOKIE_SECRET = "Conspi23racySup4remac3yFal4lacy";
    console.log("-------------------DEV CONFIG ACTIVATED-----------------");

} else {
    //Production environment vars
    console.log("-------------------PRODUCTION CONFIG ACTIVATED-----------------");
}