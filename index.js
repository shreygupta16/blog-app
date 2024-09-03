const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");

const redis = require("redis");

let RedisStore = require("connect-redis").default
let redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});

(async () => {
    try{
        await redisClient.connect();
    }catch(err){
        console.log(err);
    }
})();

// const temp = await redisClient.connect();

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
    .connect(mongoURL)
    .then(() => console.log("Successfully connected to DB"))
    .catch((err) => {
        console.log(err);
        setTimeout(connectWithRetry, 5000)
    });
}

connectWithRetry();

let redisStore = new RedisStore({client: redisClient});

app.enable("trust proxy");
app.use(cors({}));
app.use(session({
    store: redisStore,
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 60000,
    },
}));

app.use(express.json());

app.get("/api/v1/", (req, res) => {
    res.send("<h2> Hi There!!!! </h2>");
    console.log("yea it ran");
})

//localhost:3000/
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`))