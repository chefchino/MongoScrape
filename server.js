var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");


var app = express();
var PORT = process.env.PORT || 3001;
app.use(express.static("public"));
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");
  
var databaseUrl = "news";
var collections = ["articles"];

// var db = mongojs(databaseUrl, collections);

// db.on("error", function(error) {
//     console.log("Database Error:" , error);
// });

// app.get("/", function(req, res) {
//     res.send("I'm IN");
// });

// app.get("/all", function(req, res) {
//     db.articles.find({}, function(error, found) {
//         if (error) {
//             console.log(error);
//         }
//         else {
//             res.json(found);
//         }
//     });
// });

app.listen(PORT, function() {
    console.log("App running on PORT 3000+1!!");
});