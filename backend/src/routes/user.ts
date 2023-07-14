import express from 'express'
import * as UserController from '../controllers/user'

const router = express.Router()

router.get('/', UserController.getAuthenticatedUser)
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/logout', UserController.logout)

export default router