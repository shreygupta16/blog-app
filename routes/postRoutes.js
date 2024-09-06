const express = require("express");

const postController = require("../controllers/postController");
const protect = require("../middleware/authMiddleware")

const router = express.Router();

//localhost:3000/api/v1/posts/
router.route("/").get(postController.getAllPosts).post(protect, postController.createPost);

router.route("/:id").get(postController.getOnePost).patch(protect, postController.updatePost).delete(protect, postController.deletePost);

router.route("/like/:id").get(protect, postController.likePost);
router.route("/dislike/:id").get(protect, postController.dislikePost);

module.exports = router;