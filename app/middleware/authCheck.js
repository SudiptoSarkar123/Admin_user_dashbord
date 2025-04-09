const jwt = require('jsonwebtoken');
const flash = require('connect-flash');


const AuthCheck = (req, res, next) => {

    try {

        // Retrieve the token from the cookies
        const token = req.headers['auth-token'] || req.cookies.authToken;

        // Check if the token exists
        if (!token) {
            req.flash('error', 'Authentication token is missing');
            return res.redirect('/api/login');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded;
        console.log('afetr login data', req.user);
    } catch (err) {
        req.flash('error','Authentication token is invalid');
        return res.redirect('/api/login')
    }
    next();

}

module.exports = { AuthCheck }