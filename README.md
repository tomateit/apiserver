This project was a bit bootstrapped with [express-generator](https://www.npmjs.com/package/express-generator).

Below you will find some information on how to perform common tasks and understand some edge-cases.<br>

## Table of Contents

- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm run dev](#npm-run-dev)
  - [npm run server](#npm-runserver)
- [Main page (one with table)](#main-page)

## Folder Structure

After creation, your project should look like this:

```
apiserver/
  bin/
    www   #Start script
  config/
    config.js   #DEV ENV variables
  db/
    mongoose.js   #connection to MongoDB
  logs/
  middleware/
    authenticate.js
  models/
  node_modules/
  public/
  routes/
    adminRoutes.js   #Routes for Create/Update/Delete operations, auth required
    publicRoutes.js  #Public API, READ-ONLY, no auth
    userRoutes.js  #Roles management, AAA 
  views/
  index.js  #Entry point
  license.txt
  package.json
  package-lock.json
  README.md  #You are here

//some files are ommited for clarity
  
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app start script - `/bin/www`.<br>

### `npm run dev`

Launches index.js from nodemon.<br>
That is probably what you need for standalone development.


Default port 3010
 


