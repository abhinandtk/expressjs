import { Router } from "express";
import productRouter from "./products.mjs"
import userRouter from "./users.mjs"

const router=Router()

router.use(productRouter)
router.use(userRouter)

export default router