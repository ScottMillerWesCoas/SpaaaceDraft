const fs = require('fs');

require('dotenv').config(); 

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const path = require('path');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db.js');
const User = require('./models/User');

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());

app.use(express.static(path.join(__dirname + '/')));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//const config = require('config'); 

const secret = process.env.JWTSecret; 

const routeObj = {
  '/signIn': '/views/signIn.html',
  '/signUp': '/views/signUp.html'
};

const authCheck = async (req, res, next) => {
  const token = req.query.t;
  if (!token) {
    console.log('no token, redirecting');
    res.redirect('/?err=Access%20denied.%20You%20must%20log%20in.');
  } else {
    try {
      
      //decode token
      console.log("DECODING TOKEN"); 
      console.log(token); 
      const decoded = jwt.verify(token, secret);
      console.log("decoded"); 
      console.log(decoded); 
      const userExists = await User.findById(decoded.user.id);
      if (!userExists) {
        //use res.redirect instead of res.sendFile so url changes
        //res.sendFile(path.join(__dirname, './views/welcome.html'));
        res.redirect('/?err=Access%20denied.%20No%20such%20user.');
      } else {
        console.log('Found user in DB : ', userExists.id);
        next();
      }
    } catch (err) {
      console.log(err.message);
      res.redirect('/?err=Access%20denied.%20Session%20timeout.');
    }
  }
};


app.use('/user', require('./routes/user'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './views/welcome.html'));
});

app.get('/galaxy', authCheck, function(req, res) {
  res.sendFile(path.join(__dirname, './views/galaxy.html'));
});

app.get('/spacePic', authCheck, function(req, res) {
  res.sendFile(path.join(__dirname, './views/spacePic.html'));
});

app.get('/*', function(req, res) {
  if (routeObj.hasOwnProperty(req.originalUrl)) {
    res.sendFile(path.join(__dirname, routeObj[req.originalUrl]));
  } else {
    res.status(401).json({ err: 'no such file' });
  }
});

app.listen(process.env.PORT || 3001, function() {
  console.log("You're listening on port", process.env.PORT || 3001 + '.');
});

connectDB();
