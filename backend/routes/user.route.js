import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { getProfile ,followUnfollowUser ,getSuggestedUser} from '../controller/user.controller.js'

const router = express.Router()

router.get("/profile/:username" ,protectRoute, getProfile)
router.post("/follow/:id" ,protectRoute, followUnfollowUser)
router.get("/suggested",protectRoute,getSuggestedUser)

export default router