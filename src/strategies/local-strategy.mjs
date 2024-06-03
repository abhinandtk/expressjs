import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
    console.log(`Inside serialize user`);
    console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log(`Inside deserializeUser user`);
    console.log(`Deserializing user id:${id}`);

  try {
    const findUser = mockUsers.find((user) => user.id === id);
    if (!findUser) throw new Error("User not found");
    done(null,findUser)
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy({ usernameField: "user_name" }, (username, password, done) => {
    console.log(`username ${username}`);
    console.log(`password ${password}`);
    try {
      const findUser = mockUsers.find((user) => user.username === username);
      if (!findUser) throw new Error("User not found");
      if (findUser.passowrd !== password)
        throw new Error("Invalid credentials");
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
