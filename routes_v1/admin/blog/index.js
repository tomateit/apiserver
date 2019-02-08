const express = require('express');
const path = require("path")
const Router = express.Router();
const { authenticate } = require('../../../middleware/authenticate');
const { validateQueryParams } = require('../../../middleware/validateQueryParams');
const slugifyFunction = require('slugify')
const { ObjectID } = require('mongodb');
const { Blogpost } = require('../../../models/Blogpost');
const { FeedPost } = require('../../../models/FeedPost');

const makeSlug = (str) => str.toLowerCase().replace(/[^.A-z0-9]/g, "-").replace(/--+/g, "-").replace(/\W+$/g, "");

const slugify = (str) => {
    return slugifyFunction(str, {remove: /[*+~.()'"?!\[\]:@]/g, lower: true})
}

Router.post('/uploadpic', (req, res) => {
     // TODO 201 + Location header
    console.log(`RECIEVED POST REQUEST FOR ${req.url}: ${JSON.stringify(req.body)}`);
    let image;
    let uploadPath;

    if (Object.keys(req.files).length == 0) {
        res.status(400).respond({message: 'No files were uploaded.'});
        return;
    }
    image = req.files.image;
    let name = Date.now()+makeSlug(image.name);
    uploadPath = path.join(__dirname , "..", "..","..", "public","images", name);
    image.mv(uploadPath, function(error) {
        if (error) {
            return res.status(500).respond({error});
        }
        res.respond(null, "/images/"+name);
    });
});

Router.get('/', (req, res) => {
    console.log(`RECIEVED GET REQUEST FOR ${req.url}`);
    Blogpost.find()
        .sort({publishedDate: -1})
        .then((data) => {
            res.respond(null, data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).respond({message: " /blog request failed. Please try later, or contact tech support", error});
        });
});

// Router.get('/category/:category',validateQueryParams, (req, res) => {
//     console.log(`RECIEVED GET REQUEST FOR ${req.url}`);
//     Blogpost.find({published: true, category: req.params.category}, {title:1, description: 1, publishedDate:1, views: 1, slug: 1,figure:1, category: 1, _id: 0}, req.query)
//         .sort({publishedDate: -1})
//         .then((data) => {
//             res.respond(null, data);
//         })
//         .catch((error) => {
//             console.error(error);
//             res.status(500).respond({message: `${req.url} request caused unexpected error`});
//         });
// });


// Router.get('/:slug', (req, res) => {
//     console.log(`RECIEVED GET REQUEST FOR ${req.url}`);
//     let viewsIncrement = 1
//     if (req.query.seen) {
//         viewsIncrement=0
//     }
//     Blogpost.findOneAndUpdate({published: true, slug: req.params.slug }, {$inc: {views: viewsIncrement}}, {projection: {title:1, description: 1, views: 1, content: 1,category: 1, publishedDate:1}})
//         .then((data) => {
//             if(!data) {
//                 return res.status(404).respond({message: `Post ${req.params.slug} not found, please check your link`})
//             }
//             res.respond(null,data);
//         })
//         .catch((error) => {
//             console.log(error);
//             res.status(500).respond({message: `Unexpected error while requesting for ${req.url}`});
//         });
// });


Router.get('/:_id', (req, res) => {
    console.log(`RECIEVED GET REQUEST FOR ${req.url}`);
    if (!ObjectID.isValid(req.params._id)) {
        console.error('400 INVALID ID');
        return res.status(400).respond({ message: `INVALID ObjectID ${req.params._id}`, error: "EOBJECTID"});
    }
    Blogpost.findById(req.params._id)
        .then((data) => {
            res.respond(null, data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).respond({message: "Unexpected error",error});
        });
});

// TODO not mutate req.body
Router.post('/',authenticate, (req, res) => {
     // TODO 201 + Location header
    console.log(`RECIEVED POST REQUEST TO ${req.url} WITH PAYLOAD TITLE: ${req.body.title}`);
    try {
        req.body.slug = slugify(req.body.title);
    } catch (error) {
        console.error(error)
        return res.status(400).respond({message: "Couldn't create slug for title", error})
    }
    //! inconsistent result
    req.body.author = { name: req.user.fullname||req.user.username, _id: req.user._id}

    const newDoc = new Blogpost(req.body);
    newDoc.save()
        .then((data) => {
                console.log(`SAVING DATA FROM POST REQUEST:  ${data.title}`);
                res.respond(null,data);
                FeedPost.log(req.user, "created", `blogpost ${data.title}`)
        })
        .catch((error) => {
            console.error(error);
            res.status(500).respond({message: "Couldn't create new post", error});
        });   
});


Router.put('/:_id',authenticate, (req, res) => {
    if (!ObjectID.isValid(req.params._id)) {
        console.error(`400 PUT ${req.url} DUE TO INVALID ID`);
        res.status(400).respond({message: "Malformed id provided!"});
    }

    console.log(`RECIEVED PUT REQUEST TO ${req.url}:`, req.body.title);
    if (req.body.title) {
       try {
        req.body.slug = slugify(req.body.title);
        } catch (error) {
            console.error(error)
            return res.status(400).respond({message: "Couldn't create slug for title", error})
        } 
    }
    
    //! inconsistent result
    req.body.author = { name: req.user.fullname||req.user.username, _id: req.user._id}
    // req.body.lastUpdate = Date.now();
    delete req.body.lastUpdate;
    delete req.body.publishedDate;
    Blogpost.findByIdAndUpdate(req.params._id, 
        {   $set: req.body },
        { new: true })
        .then((data) => {
            console.log(`PUT BY ID SUCCESSFUL FOR: ${data.title}`);
            FeedPost.log(req.user, "updated", `blogpost ${data.title}`)
            res.respond(null, data);
        }, (error) => {
            console.error("UPDATE ERROR: ",error);
            res.status(400).respond({message: "Update error", error})
        })
        .catch((error) => {
            console.error(error);
            res.status(500).respond({ message: "Unexpected error", error});
        });
});


Router.delete('/:_id',authenticate, (req, res) => {
    console.log(`RECIEVED DELETE REQUEST TO ${req.url}`);
    if (!ObjectID.isValid(req.params._id)) {
        console.error(`400 DELETE ${req.url} DUE TO INVALID ID`);
        res.status(400).respond({message: "Malformed id provided!"});
    }
    Blogpost.findByIdAndDelete(req.params._id).then((data) => {
        console.log('ITEM DELETED: ', data);
        res.respond(null,data);
        FeedPost.log(req.user, "deleted", `blogpost ${data.title}`)
    }).catch((error) => {
        console.error(error);
        res.status(400).respond({error,message: "COULDN'T DELETE"})
    });
});


module.exports = Router;