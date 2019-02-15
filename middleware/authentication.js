var jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {

    // 1. See if there is a token on the request...if not, reject immediately
    //
    const userJWT = req.cookies.jwt
    if (!userJWT) {
        // res.send(401, 'Invalid or missing authorization token')
        // res.render('login', { title: 'Login' })
        res.redirect('/auth/login')
    }
  
    //2. There's a token; see if it is a valid one and retrieve the payload
    //
    else {
        const userJWTPayload = jwt.verify(userJWT, 'secret')
        if (!userJWTPayload) {
            //Kill the token since it is invalid
            //
            res.clearCookie('jwt')
            // res.send(401, 'Invalid or missing authorization token')
            // res.render('login', { title: 'Login' })
            res.redirect('/auth/login')
        }
        else {
  
            //3. There's a valid token...see if it is one we have in the db as a logged-in user
            //
            // User.findOne({'twitterAccessToken': userJWTPayload.twitterAccessToken})
            //     .then(function (user) {
            //         if (!user) {
            //             res.send(401, 'User not currently logged in')
            //         }
            //         else {
            //             console.log('Valid user:', user.name)
            //             next()
            //         }
  
            //     })
            next()
        }
    }
  }