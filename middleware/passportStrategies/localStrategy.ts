import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById, isUserValid } from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';


const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = getUserByEmailIdAndPassword(email, password);

    if (!user) {
      return done(null, false, { message: "User not found. Please register." });
    }
    if (!isUserValid(user, password)) {
      return done(null, false, { message: "Your login details are not valid. Please try again." });
    }
    return done(null, user); 
  }
);

/*
FIX ME (types) DONE 😭
*/
passport.serializeUser(function (user: Express.User, done: (err: any, id?: number) => void): void {
  done(null, user.id);
});


/*
FIX ME (types) DONE 😭
*/
passport.deserializeUser(function (id: number, done: (err: any, user?: Express.User | null) => void): void {
  const user = getUserById(id); 
  if (user) {
    done(null, user);
  } else {
    done(new Error("User not found"), null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
