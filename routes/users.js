const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { ensureLoggedIn, ensureAdmin, ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user");
/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        let users =  await User.all();
        return res.json(users)
    } catch(e) {
        next(e)
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
 router.get('/:username', ensureCorrectUser,  async (req, res, next) => {
    try{
        let username = req.params.username
        let users =  await User.get(username);
        return res.json(users)
    } catch(e){
        next(e)
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
 router.get('/:username/to', ensureCorrectUser, async (req, res, next) => {
    try {
        let username = req.params.username
        let userMessagesTo =  await User.messagesTo(username);
        return res.json(userMessagesTo);
    } catch (e){
        next(e);
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
 router.get('/:username/from', ensureCorrectUser, async (req, res, next) => {
     
    try {
        let username = req.params.username
        let userMessagesFrom =  await User.messagesFrom(username);
        return res.json(userMessagesFrom);
    }catch (e){
        next(e);
    }
    
})

 module.exports = router;