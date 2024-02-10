const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { CreateBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, liketheBlog } = require("../controller/blogCtrl");
const router = express.Router();


router.post('/',authMiddleware,isAdmin, CreateBlog)
router.put("/likes", authMiddleware, liketheBlog);
router.put('/:id',authMiddleware,isAdmin, updateBlog)
router.get('/:id', getBlog)
router.get('/', getAllBlogs)
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);





module.exports = router;