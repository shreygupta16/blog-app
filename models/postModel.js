const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        require: [true, "Post must have title"]
    },
    body:{
        type: String,
        require: [true, "Post must have body"]
    },
    likes:{
        type: Number,
        require: [true, "Post must have <= 0 likues"]
    }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;