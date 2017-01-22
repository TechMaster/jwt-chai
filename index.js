const express = require("express");
const app = express();

const _ = require("lodash");

const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;


const users = [
  {
    id: 1,
    name: 'jonathanmh',
    password: '%2yx4'
  },
  {
    id: 2,
    name: 'test',
    password: 'test'
  }
];


const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'tasmanianDevil';

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  const user = users[_.findIndex(users, {id: jwt_payload.id})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);
app.use(passport.initialize());

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", (req, res) => {
  res.json({message: "Express is up!"});
});

app.post("/test", (req, res) => {
  res.json({data: req.body.name});
});


app.post("/login", (req, res) => {
  let name;
  let password;
  if (req.body.name && req.body.password) {
    name = req.body.name;
    password = req.body.password;
  }
  // usually this would be a database call:
  const user = users[_.findIndex(users, {name: name})];
  if (!user) {
    res.status(401).json({message: "no such user found"});
  }


  if (user.password === password) {
    // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
    const payload = {id: user.id};
    const token = jwt.sign(payload, jwtOptions.secretOrKey);  //Ký vào payload sử dụng secretOrKey
    res.json({message: "ok", token: token});  //và trả về
  } else {
    res.status(401).json({message: "passwords did not match"});
  }
});


app.get("/secret", passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({message: "secret", data: "Here list of CIA agents in Moscow"});
});


// xem bài viết http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
// Khi bỏ lệnh kiểm tra, app.listen sẽ bị gọi lại nhiều lần
if (!module.parent) {
  app.listen(3000, () => {
    console.log("Express running at port 3000");
  });
}


module.exports = app; // for mocha testing