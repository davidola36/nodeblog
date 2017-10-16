var express = require('express');
var router = express.Router();
var mongo = require ('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


router.get('/show/:id', function(req, res, next){
	var posts = db.get('posts');
	posts.find({_id:req.params.id}, {},  function(err, posts){
		res.render('show',{
			"posts": posts	
		});
	});
});

router.get('/add', function(req, res, next){
	var categories = db.get('categories');
	categories.find({},{}, function(err, categories){
		res.render('addpost',{
			"title": "Add Post",
			"categories": categories	
		});
	});
});


router.post('/addcomment', upload.single('mainimage'), function(req, res, next){
	// get form values
	var name        = req.body.name;
	var email       = req.body.email;
	var body        = req.body.body;
	var postid      = req.body.postid;
	var commentdate = new Date();
	console.log(req.body);
	// form validation
	req.checkBody('name', 'Title field is required').notEmpty();
	req.checkBody('email', 'Title field is required').notEmpty();
	req.checkBody('email', 'Title field is required').isEmail();
	req.checkBody('body', 'Body field is required').notEmpty();

		
	//check Errors
	var errors = req.validationErrors();
	
	if(errors){
		var posts = db.get('posts');
		posts.find({_id:req.params.id}, {}, function(err, posts){
				res.render('show',{
				'errors': errors,
				'posts': posts,
			});
		});
	}else{
		var comment = {"name": name, "email": email, "body": body, "commentdate": commentdate}
		var posts = db.get('posts')
		// submit to db
		posts.update({
				"_id": postid	
			},
			{
				$push:{
					"comments":comment	
				}	
			},
			function(err, doc){
				if (err){
					throw err;	
				}else{
					req.flash('sucess', 'Comment Added');
					res.location('/posts/show/'+postid);
					res.redirect('/posts/show/' +postid);	
				}	
			}	
		);
	}
});

router.post('/add', upload.single('mainimage'), function(req, res, next){
	// get form values
	var title = req.body.title;
	var category = req.body.category;
	var body  = req.body.body;
	var author = req.body.author;
	var date = new Date();
	
	if(req.file){console.log(req.file);
		var mainImageOriginalName= req.file.originalname;
		var mainImageName = req.file;
		var mainImageMime = req.file.mimetype;
		var mainImagePath = req.file.path;
		var mainImageExt = req.file.extension;
		var mainImageSize = req.file.size;	
	}else{
		var mainImageName = 'noimage.png';
	}
	
	// form validation
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required').notEmpty();
	
	
		
	//check Errors
	var errors = req.validationErrors();
	
	if(errors){
		var posts = db.get('posts');
		posts.find
		res.render('addpost',{
			'errors': errors,
			'title': title,
			'body': body
		});	
	}else{
		var posts = db.get('posts');
		
		// submit to db
		posts.insert({
			'title': title,
			'body': body,
			'category': category,
			'date': date,
			'author': author,
			'mainimage': mainImage	
		}, function(err, post){
			if(err){
				res.send('there was an issue submitting the post');	
			}else{
				req.flash('sucess', 'Post Submitted');
				res.location('/');
				res.redirect('/');	
			}
			
		});	
	}
});


module.exports = router;
