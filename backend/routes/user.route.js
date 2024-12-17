import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { getProfile ,followUnfollowUser } from '../controller/user.controller.js'

const router = express.Router()

router.get("/profile/:username" ,protectRoute, getProfile)
router.post("/follow/:id" ,protectRoute, followUnfollowUser)

export default router