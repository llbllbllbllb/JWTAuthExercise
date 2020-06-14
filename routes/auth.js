const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const {registerValidation,loginValidation} = require('../validation');




router.post('/register', async (req,res)=>{
    
    // validate data received
    const {error} = registerValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    // check email already exists
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist){
        return res.status(400).send("Email already registered.");
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (error) {
        res.status(400).send(error);
    }

});


// Login
router.post('/login', async (req,res) => {

    // validate data received
    const {error} = loginValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    // check email exists
    const user = await User.findOne({email: req.body.email});
    
    if(!user){return res.status(400).send("Email or password wrong.");}
    // compare password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Email or password wrong.");


    // success
    // create and assign token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);

    
    // return res.status(200).send("Logged in!");

    

});


module.exports = router;