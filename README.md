Below you will find some information on how to perform common tasks and understand some edge-cases.<br>

## Table of Contents
- [Conventions](#conventions)
  - [Naming conventions](#naming-conventions)
  - [Architechtural decisions](#architechtural-decisions)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)


## Conventions

### Naming conventions
- Files with "_" (underscore) in their names are expected to be launchable from shell
- Files, used by app, are named in snakeCase, except some service files, which are named using "-" (hyphens), e.g. "package-losh.json"
- If folders contain only index.js file, it contains all folder's code, otherwise it links other files from the folder, and shouldn't contain any other code.
- Filenames of files that export classes are capitalizes (e.g. models). 
- URI tokens should use "-" (hyphen) as separator, (e.g )

### Architechtural decisions
- Common URI pattern is "site.com/[version(v1)]/[permission space (public/admin)]/[entity name][/[entity ID or special data subset]/[special data subset]]"
- API divided into public and admin area, and, besides using same data models and following same patterns, return sanitized and non-sanitized information respectively.
- API generally returns response objects of two types : sucseeded and failed.
- If request, that requires authentication, fails ,such request are considered confidential and may contain 
bare error objects alongside with messages.
- Public requests mustn't contain any server information. "error" response properties are simplified or omited.
- In any case error must be logged into stderr.
- Routes, that include path parameter (id, slug), in case of returning no data considered errored, and respond with {success: false,}.
- Routes, that use allow query params, such as limit or skip, in case of returning no data, respond with {success: true,}.

## Folder Structure

```
  launch_api #Start script
  db/
    mongoose.js   #connection to MongoDB
  logs/
  middleware/
  models/
  routes_v[X]/ #controllers folder postfixed with underscore and version
  server.js  # includes all routes and common middlware connection.
  .env # required
  README.md  #You are here

//some files are ommited for brevity
  
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app start script - `launch_api`.<br>

 


