const LocalStrategy 	=	require('passport-local').Strategy
const bcrypt 			=	require('bcrypt');
function initialize (passport){
	const authenticateUser = (email, password, done) => {
		const user = getUserByEmail(email);
		if(user==null){
			return done(null, false , {message: "No user eith that email"})
		}

		try{
			if (await bcrypt.compare(password,user.password)){
				return done(null, user);
			}else{
				return done(null, false , {message: "password not matched"})
			}
		}catch (e) {
			return done(e);
		}
	}

	passport.use(new LocalStrategy({ usernameField : 'email' }),
	authenticateUser)

	passport.serializeUser((user, done) => {

	});

	passport.deserializeUser((id, done) => {

	});
}