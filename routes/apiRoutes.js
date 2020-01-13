const router = require('express').Router();

router.route('/').get((req, res) => {
    console.log("hello world");
    res.render('index', {layout: 'main', template: 'index-template'});
});

module.exports=router;