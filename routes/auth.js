const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const User = require("../models/user");
const { authenticate } = require("../models/user");
/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

 router.post('/login', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw new ExpressError("Username and password required", 400);
      }
      if (await User.authenticate(username, password)){
        let token = jwt.sign({username}, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({token});
      }
      return res.json(auth);
    } catch (e) {
      return next(e);
    }
  });


router.get('/', (req, res, next) => {
    return res.send("it works")
});

 router.post('/register', async (req, res, next) => {
    try {
        let {username} = await User.register(req.body);
        let token = jwt.sign({username}, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({token});
      }
    
      catch (err) {
        return next(err);
      }
  });
/** POST /register - register user: registers, logs in, and returns token.
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
module.exports = router;