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
  
var databaseUrl = "mongodb://localhost/news";
var collections = ["articles"];

// mongoose.connect(databaseUrl, collections);
mongoose.connect(databaseUrl, {useNewUrlParser:true, useUnifiedTopology:true});
db = require("./models");
axios.get("https://www.bbc.com").then(function(response) {

  var $ = cheerio.load(response.data);

  var results = [];

  $("ul.media-list--fixed-height h3.media__title").each(function(i, element) {

    var title = $(element).children().text().trim();
    var link = $(element).find("a").attr("href");
    var summary = $(element).siblings().text().trim()
    var photo = $(element).parent().siblings().find("img").attr("src");
    let data= {
        title: title,
        link: link,
        summary: summary,
        photo: photo
    }
    // results.push(data)
    db.Article.create(data)
    .then(function(newsArt) {
        console.log("newsArt", newsArt)
    })
    .catch(function(err) {
        console.log(err.message);
    });
});

//   console.log(results);
});

const apiRoute = require('./routes/apiRoutes');
app.use('/', apiRoute);


app.listen(PORT, function() {
    console.log("App running on PORT 3000+1!!");
});
