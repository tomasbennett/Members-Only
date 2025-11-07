import express, { Request, Response } from "express";
import session from "express-session";


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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





app.get("/", (req: Request, res: Response) => {
  res.send(`<h1>Session demo</h1><p>Visit /set, /get, /touch, /destroy</p>`);
});

app.get("/set", (req: Request, res: Response) => {
  req.session.counter = (req.session.counter ?? 0) + 1;
  req.session.lastSet = new Date().toISOString();
  res.json({ message: "set", session: req.session });
});

app.get("/get", (req: Request, res: Response) => {
  res.json({ session: req.session });
});

app.get("/touch", (req: Request, res: Response) => {
  req.session.touch();
  res.json({ message: "touched", cookie: req.session.cookie });
});

app.get("/destroy", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ err });
    res.clearCookie("sid");
    res.json({ message: "session destroyed" });
  });
});







app.listen(3000, () => { 
  console.log("Listening on http://localhost:3000"); 

});
