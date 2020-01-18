var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
db = require("./models");

var PORT = process.env.PORT || 3001;
var app = express();
app.use(express.static("public"));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

var databaseUrl = "mongodb://localhost/news";


mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });


axios.get("https://www.bbc.com").then(function (response) {

  var $ = cheerio.load(response.data);

  var results = [];

  $("ul.media-list--fixed-height h3.media__title").each(function (i, element) {

    var title = $(element).children().text().trim();
    var link = $(element).find("a").attr("href");
    var summary = $(element).siblings().text().trim()
    var photo = $(element).parent().siblings().find("img").attr("src");
    let data = {
      title: title,
      link: link,
      summary: summary,
      photo: photo
    }
    // results.push(data)
    db.Article.create(data)
      .then(function (newsArt) {
        console.log("newsArt", newsArt)
      })
      .catch(function (err) {
        console.log(err.message);
      });
  });

  //   console.log(results);
});
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (data) {
      console.log("data", data)
      // res.json(dbArticle);
      let renderStuff = [];
      for (var i = 0; i < data.length; i++) {
        var articleData = {
          title: data[i].title,
          summary: data[i].summary,
          link: data[i].link
        };
        renderStuff.push(articleData)
      }
      // data.forEach(object =>{
        // var articleData = {
        //   title: object.title,
        //   summary: object.summary,
        //   link: object.link
        // };
        // renderStuff.push(object)
      // })
      res.render("index", { Article: renderStuff })
    })
    // })
    .catch(function (err) {
      res.json(err);
    });
});
const apiRoute = require('./routes/apiRoutes');
app.use('/', apiRoute);


app.listen(PORT, function () {
  console.log("App running on PORT 3000+1!!");
});

module.exports = app;