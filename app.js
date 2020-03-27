const 	express		=	require('express'),
		ejs			=	require('ejs'),
		app			=	express();



app.get('/',(req,res) => {
	res.send('Started Fine');
});


const port = process.env.PORT || 3000;
app.listen(port,() => {
	console.log("Server started at port : " , port);
})