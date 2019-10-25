const express = require('express');
const bodyParser = require('body-parser');
const profileRouter = express.Router();

profileRouter.use(bodyParser.json());

var Profiles = require("../models/profiles");
var Experiences = require("../models/experience")

profileRouter.route('/')
    .get((req, res, next) => {
        Profiles.find({}).then(app => {
            res.json(app);
        })
    })
    .post(async (req, res, next) => {
        var find = await Profiles.find({ username: req.user })
        console.log(find);
        if (find.length > 0) {
            res.statusCode = 400;
            res.send("User " + req.user + " already existing")
        }
        else {
            req.body.username = req.user;
            try {
                var newProfile = await Profiles.create(req.body);
                res.send(newProfile)
            }
            catch (err) {
                res.status(err.status || 500);
                res.json({
                    message: err.message,
                    error: err
                });
            }
        }

    })
    .put(
        (req, res, next) => {
            Profiles.findOneAndUpdate(
                { username: req.user },
                { $set: req.body },
                { new: true }
            )
                .then(
                    app => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(app);
                    },
                    err => next(err)
                )
                .catch(err => next(err));
        }
    )


profileRouter.get("/me", (req, res) => {
    Profiles.findOne(
        { username: req.user }
    )
        .then(
            app => {
                res.json(app);
            },
            err => next(err)
        )
        .catch(err => next(err));
}
)

profileRouter.get("/:userName", (req, res) => {
    Profiles.findOne(
        { username: req.params.userName }
    )
        .then(
            app => {
                res.json(app);
            },
            err => next(err)
        )
        .catch(err => next(err));
})

profileRouter.route("/:userName/experiences")
    .get(async (req, res) => {
        res.json(await Experiences.find({ username: req.params.userName }));
    })
    .post(async (req, res) => {
        req.body.username = req.user.username;
        var exp = await Experiences.create(req.body)
        res.json(exp);
    })

profileRouter.route("/:userName/experiences/:expId")
    .get(async (req, res) => {
        res.json(await Experiences.findById(req.params.expId));
    })
    .put(async (req, res) => {
        var exp = await Experiences.findById(req.params.expId);
        if (exp.username == req.user) {
            var updated = await Experiences.findByIdAndUpdate(req.params.expId, req.body)
            res.json(updated);
        }
        else {
            res.status(401);
            res.send("Unauthorized")
        }
    })
    .delete(async (req, res) => {
        var exp = await Experiences.findById(req.params.expId);
        if (exp.username == req.user) {
            await Experiences.findByIdAndDelete(req.params.expId)
            res.send("Deleted");
        }
        else {
            res.status(401);
            res.send("Unauthorized")
        }
    })


module.exports = profileRouter;