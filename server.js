var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var Handlebars = require("handlebars");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var mongojs = require("mongojs");
db = require("./models");
var PORT = process.env.PORT || 3002;
var app = express();
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("public"));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
var databaseUrl = process.env.MONGODB_URI || "mongodb://localhost/news";
mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  app.get("/scrape", function (req, res) {
    axios.get("https://www.bbc.com").then(function (response) {
      var $ = cheerio.load(response.data);
      $("ul.media-list--fixed-height h3.media__title").each(function (i, element) {
        var title = $(element).children().text().trim();
        var links = $(element).find("a").attr("href");
        var links1 = links.charAt(0)==="/" ? "https://www.bbc.com"+links : links
        var summary = $(element).siblings().text().trim()
        var photo = $(element).parent().siblings().find("img").attr("src");
        let data = {
          title: title,
          links: links1,
          summary: summary,
          photo: photo
        }
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
      console.log("data", data)
      let renderStuff = [];
      for (var i = 0; i < data.length; i++) {
        var articleData = {
          id: data[i]._id,
          title: data[i].title,
          summary: data[i].summary,
          links: data[i].links,
          photo: data[i].photo
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
  db.Article.find({})
  .populate("notes")
  .then(function(data) {
    let renderSaved = [];
    for (i=0;i<data.length;i++) {
      var articleSaved = {
        id: data[i]._id,
        title: data[i].title,
        summary: data[i].summary,
        links: data[i].links, 
        photo: data[i].photo,
        notes: data[i].notes.map(note => note.note )
      };
      renderSaved.push(articleSaved)
    }
    res.render("saved", {Article: renderSaved})
  })
})
app.get("/delete/:id", function (req, res) {
  console.log("I'm IN", mongojs.ObjectId(req.params.id))
  db.Article.remove(
    {
      _id: mongojs.ObjectId(req.params.id)
    }, 
    function (err, removed) {
      console.log("removed", removed)
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log("deleted article");
      res.send(removed);
    }
  });
  });
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
app.post("/notes/:id", function (req, res) {
  console.log("notes", req.url, req.params, req.body)
  db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate({_id:req.params.id}, { $push: { notes: dbNote._id}}, { new: true});
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
})

Handlebars.registerHelper("link", function(text,  links) {
  var url = Handlebars.escapeExpression(links),
      // linking = Handlebars.escapeExpression(linking),
      text = Handlebars.escapeExpression(text)
      
 return new Handlebars.SafeString("<a href='" +   url +  "'>" + text +"</a>");
});
const apiRoute = require('./routes/apiRoutes');
app.use('/', apiRoute);
app.listen(PORT, function () {
  console.log("App running on PORT 3000+1!!");
});
module.exports = app;