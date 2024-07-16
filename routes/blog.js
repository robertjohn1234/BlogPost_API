const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog");
const { verify, verifyAdmin } = require("../auth");

router.post("/", verify, blogController.addBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", verify, blogController.getBlogById);
router.put("/:id", verify, blogController.updateBlog);
router.delete("/:id", verify, blogController.deleteBlog);
router.post("/:id/comments", verify, blogController.addBlogComment);
router.get("/:id/comments", blogController.getAllComments);
router.get('/:id/comments/:commentId', blogController.getCommentById);
router.patch('/comments/:commentId', verify, blogController.updateCommentById);
router.delete("/:id/comments/:commentId", verify, blogController.deleteCommentById);
router.post("/:id/like", verify, blogController.addLike);
module.exports = router;