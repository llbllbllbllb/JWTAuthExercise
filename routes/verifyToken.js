const jwt = require("jsonwebtoken");

// middleware
function auth(req,res,next){

    const token = req.header('auth-token');

    if(!token) return res.status(401).send('Access Denied.');

    try {

        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(verified.toString());
        console.log("hello");
        req.user = verified;

        next();

    } catch (error) {
        res.status(401).send('Invalid Token.');
    }

}

module.exports = auth;

