const express = require("express")
const User = require("../models/user")
const passport = require("passport")
const { createToken } = require("../auth")

const router = express.Router()

router.get("/", async (req, res) => {
    res.send(await User.find({}))
})


router.post("/signup", async (req, res) => {
    try {
        var user = await User.register(req.body, req.body.password)
        res.send(user)
    }
    catch (exx) {
        res.statusCode = 500;
        res.send(exx)
    }
})

router.post("/login", passport.authenticate("local"), (req, res) => {
    var token = createToken({ _id: req.user._id, username: req.user.username, email: req.user.email })
    res.send({
        success: true,
        username: req.user.username,
        email: req.user.email,
        token: token
    })
})

//1) verify the current token
router.post("/refresh", passport.authenticate("jwt"), (req, res) => {
    //2) create the new token
    var token = createToken({ _id: req.user._id, username: req.user.username });
    //3) send back the new token
    res.send({
        success: true,
        username: req.user.username,
        token: token
    })
})



// NO DATABASE INVOLVES = NO SESSION
// router.post("/verifyToken", passport.authenticate("jwt", { session: false }), (req,res)=>{
//     res.send(req.user)
// })

router.post("/verifyToken", passport.authenticate("jwt"), (req, res) => {
    res.send(req.user)
})

module.exports = router;
