const 	express		=	require('express'),
		ejs			=	require('ejs'),
		app			=	express();

app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));


app.get("/" , (req,res) => {
	res.redirect("/login");
});

app.get('/login',(req,res) => {
	res.render('login');
});

app.get('/register',(req,res) => {
	res.render('register');
});


const port = process.env.PORT || 3000;
app.listen(port,() => {
	console.log("Server started at port : " , port);
})