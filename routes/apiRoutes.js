var express = require("express");
const app = express.Router();
var article = require("../models/article")

app.route('/').get((req, res) => {

    res.render('index', {layout: 'main'});
});
// app.route('/saved').get((req, res) => {

//     res.render('saved');
// })
module.exports=app;
