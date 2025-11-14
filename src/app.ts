/// <reference path="./types/sessionExtTypes.d.ts" />

import express, { Request, Response } from "express";
import session, { type SessionOptions } from "express-session";
import passport from "passport";

import "dotenv/config";

import { resolve, join } from "path"
import { router as postsRouter } from "./controllers/posts";
import { router as loginRouter } from "./controllers/authentication";

import expressLayouts from "express-ejs-layouts";
import { ensureAuthentication } from "./services/ensureAuthentication";



const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(resolve(__dirname, "public")));


app.set("view engine", "ejs");
app.set("views", join(process.cwd(), "src/views"));
app.use(expressLayouts);
app.set("layout", "layouts/mainLayout");

app.use(
  session({
    name: "sid",
    secret: process.env.COOKIE_SECRET_NAME || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


// type IExtra = Request & { extra?: boolean };



// app.get("/", (req: Request, res: Response) => {
//   console.log(process.env.COOKIE_SECRET_NAME ?? "Please set a cookie secret in .env file!!!");

//   res.send(`<h1>Session demo</h1><p>Visit /set, /get, /touch, /destroy</p>`);
// });

// app.get("/set", (req: Request, res: Response) => {
//   req.session.counter = (req.session.counter ?? 0) + 1;
//   req.session.lastSet = new Date().toISOString();
//   res.json({ message: "set", session: req.session });
// });

// app.get("/get", (req: Request, res: Response) => {
//   res.json({ session: req.session });
// });

// app.get("/touch", (req: Request, res: Response) => {
//   req.session.touch();
//   res.json({ message: "touched", cookie: req.session.cookie });
// });

// app.get("/destroy", (req: Request, res: Response) => {
//   req.session.destroy((err) => {
//     if (err) return res.status(500).json({ err });
//     res.clearCookie("sid");
//     res.json({ message: "session destroyed" });
//   });
// });


app.get("/", ensureAuthentication, (req, res, next) => {
  return res.redirect("/posts");
});

app.use("/posts", postsRouter);
app.use("/", loginRouter);




app.listen(3000, () => { 
  console.log("Views path:", app.get("views"));
  console.log("Listening on http://localhost:3000"); 

});
