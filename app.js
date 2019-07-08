const express = require("express");
const path = require("path");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get('/', (req, res)=>{
    res.render("index", {
        "title": "Articles"
    });
});


app.get('/article/new', (req, res)=>{
    res.render("new", {
        "title": "add new article"
    });
});


app.listen(5000, ()=>{
    console.log("Server start at port 5000...");
});
