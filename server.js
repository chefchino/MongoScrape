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
axios.get("https://www.bbc.com").then(function(response) {

  var $ = cheerio.load(response.data);

  var results = [];

  $("h3.media__title").each(function(i, element) {

    var title = $(element).children().text().trim();
    var link = $(element).find("a").attr("href");

    results.push({
      title: title,
      link: link
    });
  });

  console.log(results);
});

app.listen(PORT, function() {
    console.log("App running on PORT 3000+1!!");
});