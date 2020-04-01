const LocalStrategy 	=	require('passport-local').Strategy
const bcrypt 			=	require('bcrypt');

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

async function initialize (passport, getUserByEmail, getUserById){
	const authenticateUser = async (email, password, done) => {
		const user = await getUserByEmail(email);
		if(isEmpty(user)==true){
			return done(null, false , {message: "No user eith that email"})
		}

		try{
			if ( await bcrypt.compare(password,user.password)) {
				return done(null, user);
			}else{
				return done(null, false , {message: "password not matched"})
			}
		}catch (e) {
			return done(e);
		}
	}

	passport.use(new LocalStrategy({ usernameField : 'email' },
	authenticateUser))



	passport.serializeUser((user, done) => done(null, user.id));

	passport.deserializeUser(async(id, done) => {
		return done(null, await getUserById(id));
	});
}

module.exports 	=	initialize;