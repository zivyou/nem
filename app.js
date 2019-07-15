const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoClient = require("mongodb").MongoClient;
const dbUrl = "mongodb://localhost:27017";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var dbName = "myDb";
var collectionName = "articles";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get('/', (req, res)=>{
    return res.render("index", {
        "title": "Articles"
    });
});


app.get('/article/new', (req, res, next)=>{
    mongoClient.connect(dbUrl, (err, mongo)=>{
        if (err){
            console.log("connect to db failed.");
            return res.status(500).send("mongodb error!");
        }else{
            console.log("connect to db OK!");
        }
        let db = mongo.db(dbName);
        let collection = db.collection(collectionName);
        collection.find().toArray((err, docs)=>{
            mongo.close();
            return res.render("new", {
                "allArticles": docs
            });
        });
    });
});


app.post('/article/new', (req, res, next)=>{
    let article = {"title": req.body.title, "content": req.body.content};
    mongoClient.connect(dbUrl, (err, mongo)=>{
        if (err){
            console.error("connect to db failed.");
            return res.status(500).send("mongodb error!");
        }
        let db = mongo.db(dbName);
        let collection = db.collection(collectionName);
        collection.insertOne(article, (err, re)=>{
            let v = JSON.parse(re);
            if (v.n == 1){
                mongo.close();
                return res.redirect(302, "/article/new");
            }else{
                mongo.close();
                return res.status(500).send("add article failed!");           
            }
        });
    });
});


app.listen(5000, ()=>{
    console.log("Server start at port 5000...");
});
