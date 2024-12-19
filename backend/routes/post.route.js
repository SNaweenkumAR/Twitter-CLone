
import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { createPost ,deletePost ,createComment , likeUnlikePost ,getAllPosts ,getLikedPosts ,getfollowing,getUsersPosts} from '../controller/post.controller.js'


const router = express.Router()

router.get("/all",protectRoute,getAllPosts)
router.get("/following",protectRoute,getfollowing)
router.get("/likes/:id",protectRoute,getLikedPosts)
router.get("/user/:username",protectRoute,getUsersPosts)
router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/comment/:id",protectRoute,createComment)
router.delete("/:id",protectRoute,deletePost) 


export default router