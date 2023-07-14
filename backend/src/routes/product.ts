import express from 'express'
import * as ProductController from '../controllers/product'

const router = express.Router()

router.get('/', ProductController.getProducts)
router.get('/:id', ProductController.getProduct)
router.post('/', ProductController.createProduct)
router.put('/:id', ProductController.updateProduct)
router.delete('/:id', ProductController.deleteProduct)

export default router