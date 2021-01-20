require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const User = require("./user.model");

const redis = new Redis(process.env.REDIS_URL);
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

async function addView() {
    if (!redis.get("views")) redis.set("views");
    else redis.incr("views");
}

app.get("/", async (req, res) => {
    await addView();
    res.render("index", {
        users: await User.find({}),
        views: await redis.get("views"),
    });
});

app.post("/user", async (req, res) => {
    const user = new User({ name: req.body.name });
    await user.save();
    res.render("user", { user });
});

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to database");

        app.listen(process.env.PORT, () => console.log("Server is running"));
    });
