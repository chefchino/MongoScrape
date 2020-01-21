var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var mongojs = require("mongojs");
db = require("./models");

var PORT = process.env.PORT || 3002;
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

  app.get("/scrape", function (req, res) {

    axios.get("https://www.bbc.com").then(function (response) {

      var $ = cheerio.load(response.data);

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
        // console.log("data", data)
        db.Article.create(data)
          .then(function (newsArt) {
          })
          .catch(function (err) {
            console.log(err.message);
          });
        });
      })
      res.redirect("/articles")
  })

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (data) {
      let renderStuff = [];
      for (var i = 0; i < data.length; i++) {
        var articleData = {
          id: data[i]._id,
          title: data[i].title,
          summary: data[i].summary,
          link: data[i].link
        };
        renderStuff.push(articleData)
      }
      res.render("index", { Article: renderStuff })
    })

    .catch(function (err) {
      res.json(err);
    });
});
app.get("/saved", function (req, res) {
  db.Article.find({saved: true})
  .then(function(data) {
    let renderSaved = [];
    for (i=0;i<data.length;i++) {
      var articleSaved = {
        id: data[i]._id,
        title: data[i].title,
        summary: data[i].summary,
        link: data[i].link
      };
      renderSaved.push(articleSaved)
    }
    res.render("saved", {Article: renderSaved})
  })
})
app.get("/clear", function (req, res) {
  db.Article.remove({saved: false}, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log("erased articles");
    }
  });
  res.render("index");
})
app.post("/update/:id", function(req, res) {
  db.Article.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: {
        saved: true
      }
    },
    function(error, edited) {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log("edited", edited);
        res.send(edited);
      }
    }
  );
});
const apiRoute = require('./routes/apiRoutes');
app.use('/', apiRoute);


app.listen(PORT, function () {
  console.log("App running on PORT 3000+1!!");
});

module.exports = app;