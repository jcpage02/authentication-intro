require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  const db = req.app.get("db");
  let user = await db.find_user({ email });

  if (user.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash_value = bcrypt.hashSync(password, salt);
    const createdUser = await db.create_cust({ email, hash_value });
    req.session.user = { id: createdUser[0].id, email: createdUser[0].email };
    res.status(200).send({ messge: "logged in", userData: req.session.user });
  } else {
    return res.status(200).send({ message: "email already in use" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const db = app.get("db");
  const user = await db.find_user({ email: email });
  if (user.length === 0) {
    res.status(200).send({ message: "Email not found" });
  } else {
    const result = bcrypt.compareSync(password, user[0].hash_value);
    if (result === true) {
      req.session.user = { id: user[0].id, email: user[0].email };
      console.log(req.session.user);
      return res
        .status(200)
        .send({ message: "logged in", userData: req.session.user });
    } else {
      return res.status(401).send({ message: "wrong password" });
    }
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).send("Logged out");
});

massive(process.env.CONNECTION_STRING)
  .then(connection => {
    app.set("db", connection);
    app.listen(process.env.SERVER_PORT, () =>
      console.log(`listening on port ${process.env.SERVER_PORT}`)
    );
  })
  .catch(err => {
    console.log(err);
  });
