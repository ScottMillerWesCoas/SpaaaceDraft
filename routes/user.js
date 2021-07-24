const express = require('express');
const router = express.Router();

//No longer using config, using .env files for keys/tokens, require('dotenv').config() and heroku config vars 
//to maintain keys locally/on heroku and keep out of github
//const config = require('config');

//auth
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Models
const User = require('../models/User.js');

//get data from posts on client side
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const secret = process.env.JWTSecret; 

//Dry - needed 2x, so make func
const jwtSign = (jwt, payload, secret, res) => {
  jwt.sign(payload, secret, { expiresIn: 3000 }, (err, token) => {
    if (err){
      console.log(err); 
      throw err; 
    }
    else {
      res.json({ token }); 
    }
  });
}


router.post('/signUp', jsonParser, async (req, res) => {
  try {
    

    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);

    console.log('SALT');
    console.log(salt);

    newUser.password = await bcrypt.hash(newUser.password, salt);

    console.log('pwd AFTER bcypt');
    console.log(newUser.password);

    const createdUser = await newUser.save();

    console.log('secret', secret); 

    //send back token 
    const payload = {
      user: {
        id: createdUser.id
      }
    };

    console.log('payload'); 
    console.log(payload); 

    jwtSign(jwt, payload, secret, res); 


    //res.json({ id: createdUser.id });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/signIn', jsonParser, async (req, res, next) => {
  try{
    const data = req.body; 
    console.log("data", data);

    //check for user based on submitted email address
    const userExists = await User.findOne({email: data.email}); 
    console.log("userExists", userExists);

    if (!userExists){
      console.log('NO SUCH USER'); 
      res.status(400).json({message: 'Access denied. Invalid credentials.'})
    }
    
    else {

      //check for pwd match 
      const pwdMatch = await bcrypt.compare(data.password, userExists.password); 
      
      if (!pwdMatch) res.status(400).json({message: 'Access denied. Invalid credentials.'}); 

      //send back token 
      const payload = {
        user: {
          id: userExists.id
        }
      };

      console.log('found user payload'); 
      console.log(payload); 

      jwtSign(jwt, payload, secret, res); 

    }
  } catch(err){
      res.status(500).json({message: err.message})
  }
  

})

module.exports = router; 
