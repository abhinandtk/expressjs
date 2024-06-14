import express, { response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import mongoose from "mongoose";

const app = express();

mongoose.connect("mongodb://localhost/DemoDB")
.then(()=>console.log("Connected to a database"))
.catch((error)=>console.log(error,'error connecting db'))

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "The developer",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.post(
  "/api/auth",
  passport.authenticate("local"),
  (request, response) => {
    return response.sendStatus(200)

  }
);

app.get("/api/auth/status", (request,response)=>{
  console.log("Inside auth/status/endpoint");
  console.log(request.user);
  console.log(request.session);
  return request.user? response.send(request.user):response.sendStatus(401)
})

app.post("/api/auth/logout",(request,response)=>{
  if(!request.user) return response.sendStatus(401)
    request.logout((err)=>{
  if(err) return response.sendStatus(400)
    response.send(200)
  })
})

// const loginMiddleware = (request, response, next) => {
//   console.log(request.method, request.url);
//   next();
// };
// // app.use(loginMiddleware)

const PORT = process.env.PORT || 3000;

app.get(
  "/",

  // (request, response, next) => {
  //   console.log("baseurl1");
  //   next();
  // },
  // (request, response, next) => {
  //   console.log("baseurl2");

  //   next();
  // },
  // (request, response, next) => {
  //   console.log("baseurl3 ");

  //   next();
  // },
  (request, response) => {
    console.log(request.session, "session"),
      console.log(request.session.id, "sessionId");
    request.session.visited = true;
    response.cookie("hello", "world", { maxAge: 8000, signed: true });
    response.status(200).send({ msg: "Hello world" });
  }
);

app.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.passowrd !== password)
    return response.status(401).send({ msg: "BAD CREDENTIALS" });
  request.session.user = findUser;
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (err, session) => {
    console.log(session);
  });
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Not Authenticated" });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  const { body: item } = request;
  const { cart } = request.session;
  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }
  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? []);
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
