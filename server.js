const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const profileRouter = require("./routes/profileRouter")
const postRouter = require("./routes/postRouter")
const userRouter = require("./routes/userRouter")
//const auth = require("./auth")
const passport = require("passport")


//this could be your localhost mongodb address
const url = "mongodb+srv://diegostriveschool:h6nxg5U9SDcsLA26@cluster0-3ar0p.azure.mongodb.net/test?retryWrites=true&w=majority"
//const url = "mongodb+srv://Noah:33443344nic@node-api-y92nq.mongodb.net/test?retryWrites=true&w=majority"
const connection = mongoose.connect(url, {
    useNewUrlParser: true, useCreateIndex: true,
    useFindAndModify: false, useUnifiedTopology: true

})
connection.then(db => {
    console.log("Database Connected")
},
    err => {
        console.log(err)
    })

var server = express()
server.use(cors())
server.use(express.json()) //equal to body-parser
server.use(passport.initialize())

server.use("/post", postRouter)
server.use("/profile", profileRouter)
server.use("/user", userRouter)

server.get("/", (req, res) => {
    res.send("Hello")
})

server.listen(4000, () => {
    console.log("Server is listening on port 4000")
})