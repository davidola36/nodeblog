var express = require('express');
var router = express.Router();
var mongo = require ('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category', function(req, res, next){
	var db = req.db;
	var posts = db.get('posts');
	posts.find({category: req.params.category}, {}, function(err, posts){
		res.render('index',{
			'title': req.params.category,
			'posts': posts	
		});
	});	
});

/* Homepage Blog Posts*/
router.get('/add', function(req, res, next) {
	res.render('addcategory', {
		'title': 'Add Category'
	});
});

router.post('/add', function(req, res, next){
	console.log(req.body);
	// get form values
	var title = req.body.title;
	
	// form validation
	req.checkBody('title', 'Title field is required').notEmpty();	
	//check Errors
	var errors = req.validationErrors();
	
	if(errors){
		res.render('addcategory',{
			'errors': errors,
			'title': title,
		});	
	}else{
		var categories = db.get('categories');
		
		// submit to db
		categories.insert({
			'title': title,	
		}, function(err, category){
			if(err){
				res.send('there was an issue submitting the category');	
			}else{
				req.flash('sucess', 'Category Submitted');
				res.location('/');
				res.redirect('/');	
			}
			
		});	
	}
});

module.exports = router;
