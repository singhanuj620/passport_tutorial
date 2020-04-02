const 	express			=	require('express'),
		MongoClient		=	require('mongodb').MongoClient,
		ejs				=	require('ejs'),
		bcrypt			=	require('bcrypt'),
		passport 		=	require('passport'),
		session 		=	require('express-session'),
		flash 			=	require('express-flash'),
		methodOverride 	=	require('method-override'),
		dotenv			=	require("dotenv"),
		app				=	express();

dotenv.config();
let url = process.env.DB_URL;
let dbo;
MongoClient.connect(url,{useUnifiedTopology: true}, function(err, db) {
	  	if (err) throw err;
	  	console.log("Database created!");
	  	dbo = db.db("passporttest");
		dbo.createCollection("test", function(err, res) {
			if (err) throw err;
	    	console.log("Collection created with name : test ");
		});
	});

const initializePassport 	=	require("./passport-config");

const userEmail = async (email) => {
	let temp = await dbo.collection("test").find({email:email}).toArray();
	return temp[0];
}

const userId = async (id) => {
	let temp = await dbo.collection("test").find({id:id}).toArray();
	return temp[0];
}


initializePassport(
	passport,
	email => userEmail(email),
	id => userId(id)
);

// dbo.collection("uploadphotos").find()

app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));
app.use(flash());
app.use(session({
	secret : 'secret',
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


app.get("/" ,checkAuthenticated, (req,res) => {
	res.render('index', {name : req.user.name});
});

app.get('/login',checkNotAuthenticated,(req,res) => {
	res.render('login');
});

app.get('/register',checkNotAuthenticated,(req,res) => {
	res.render('register');
});


app.post("/register",checkNotAuthenticated, async (req,res) => {
	try{
		const hashedPassword = await bcrypt.hash(req.body.password,10);
		let data={
			id: Date.now().toString(),
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		}
		dbo.collection("test").insertOne(data);
		// users.push({
		// 	id: Date.now().toString(),
		// 	name: req.body.name,
		// 	email: req.body.email,
		// 	password: hashedPassword
		// });
		res.redirect("/login");
	}catch{
		res.redirect("/register");
	}
});

app.post("/login" ,checkNotAuthenticated, passport.authenticate('local', {
	successRedirect : '/',
	failureRedirect : '/login',
	failureFlash : true
}))


app.delete("/logout",(req,res) => {
	req.logOut();
	res.redirect("/login");
})


function checkAuthenticated(req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


function checkNotAuthenticated(req,res,next) {
	if(req.isAuthenticated()){
		return res.redirect("/");
	}
	next();
}

app.get("/test",async (req,res) => {
	let flag = await userEmail('w@w');
	res.send(flag);
});

const port = process.env.PORT || 3000;
app.listen(port,() => {
	console.log("Server started at port : " , port);
})