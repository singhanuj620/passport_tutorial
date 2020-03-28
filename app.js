const 	express		=	require('express'),
		ejs			=	require('ejs'),
		bcrypt		=	require('bcrypt'),
		passport 	=	require('passport'),
		app			=	express();

const initializePassport 	=	require("./passport-config");
initializePassport(passport);


app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

const users=[]


app.get("/" , (req,res) => {
	res.redirect("/login");
});

app.get('/login',(req,res) => {
	res.render('login');
});

app.get('/register',(req,res) => {
	res.render('register');
});


app.post("/register", async (req,res) => {
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
	console.log(users);
});

const port = process.env.PORT || 3000;
app.listen(port,() => {
	console.log("Server started at port : " , port);
})