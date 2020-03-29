if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}


const 	express		=	require('express'),
		ejs			=	require('ejs'),
		bcrypt		=	require('bcrypt'),
		passport 	=	require('passport'),
		session 	=	require('express-session'),
		flash 		=	require('express-flash'),
		methodOverride 	=	require('method-override'),
		app			=	express();


const users=[]
const initializePassport 	=	require("./passport-config");


initializePassport(
	passport,
	email => users.find(user => user.email === email ),
	id => users.find(user => user.id === id )
);


app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));
app.use(flash());
app.use(session({
	secret : process.env.SESSION_SECRET,
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
		users.push({
			id: Date.now().toString(),
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		});
		res.redirect("/login");
	}catch{
		res.redirect("/register");
	}
	// console.log(users);
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



const port = process.env.PORT || 3000;
app.listen(port,() => {
	console.log("Server started at port : " , port);
})