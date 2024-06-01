import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(routes);

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
    response.cookie("hello","world",{maxAge:60000 * 60})
    response.status(200).send({ msg: "Hello world" });
  }
);

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
