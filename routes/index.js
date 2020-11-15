var express = require('express');
var router = express.Router();
var User = require('../model/user');


router.get('/', (req, res, next) => {
	return res.render('index.ejs');
});


router.post('/', (req, res, next) => {
	console.log(req.body);
	var personInfo = req.body;

	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConfirm) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConfirm) {

			User.findOne({ email: personInfo.email }, (err, data) => {
				if (!data) {
					var count;
					User.findOne({}, (err, data) => {

						if (data) {
							console.log("if");
							count = data.unique_id + 1;
						} else {
							count = 1;
						}

						var newPerson = new User({
							unique_id: count,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConfirm: personInfo.passwordConfirm
						});

						newPerson.save((err, Person) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are registered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});


router.get('/login', (req, res, next) => {
	return res.render('login.ejs');
});


router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.password == req.body.password) {
				req.session.userId = data.unique_id;
				res.send({ "Success": "Success!" });

			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not registered!" });
		}
	});
});


router.get('/view-user-info', (req, res) =>{
    User.find({}, function(err, profile){
        res.render("home", { profile : profile});
        console.log(profile)
    })
})


router.get('/delete-user-record:id', (req, res) =>{
    const id = req.params.id
    User.findOneAndDelete(id, function(err, user) {
        if (err){
            throw err
        } 
        console.log(id)
        res.redirect('/view-user-info')
    })
})


router.get('/update-user-record', (req, res) =>{
    User.findOne({}, function(err, profile){
        res.render("updateUser", { profile : profile});
    })
})


router.post('/update-user-record:id', (req, res) =>{
        updateRecord(req, res)
})

function updateRecord(req, res) {
    User.findOneAndUpdate({ "id": req.body.id },{
        $set: {
            "email": req.body.email,
            "username": req.body.username
		}
		
     }, { new: true }, (err, user) => {
        if (!err) {  
            console.log(user);
            console.log(req.body);
            res.redirect('/view-user-info'); 
        }
        else {
            console.log(err);
        }
     });
} 


router.get('/logout', (req, res, next) => {
	console.log("You logged out successfully!")
	if (req.session) {
		// delete the session object
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});


module.exports = router;