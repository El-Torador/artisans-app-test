import type { RequestHandler } from "express"
import Product, { ProductModel } from "../models/Product"
import { eventEmitter } from '../app';

export const getProducts: RequestHandler<typeof Product> = async (req, res, next) => {
  try {
    const products = await Product.find().exec()
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id as string
    const product = await Product.findById(id).exec()
    if (!product) return res.status(404).json({ message: "This product doesn't exist." })
    res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}

export const createProduct: RequestHandler<typeof Product> = async (req, res, next) => {
  
  try {
    const {name, type, price, rating, warranty_years, available} = req.body as ProductModel
    const productData = {
      name,
      type,
      price,
      rating,
      warranty_years,
      available
    }

    const createdProduct = await Product.create(productData)
    eventEmitter.emit('createProduct', createdProduct);
    res.status(201).json(createdProduct)
  } catch (error) {
    next(error)
  }
}

export const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id as string
    const {name, type, price, rating, warranty_years, available} = req.body as ProductModel
    const productData = {
        name,
        type,
        price,
        rating,
        warranty_years,
        available
      } as Omit<ProductModel, '_id'>

    const productUpdated = await Product.findByIdAndUpdate(id, productData)
    if (!productUpdated) return res.status(404).json({message: "This product doesn't exist."})
    eventEmitter.emit('updateProduct', productData);
    res.status(200).json({})
  } catch (error) {
    next(error)
  }
}

export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id as string
    await Product.findByIdAndDelete(id)
    eventEmitter.emit('deleteProduct', id);
    res.status(200).json({}) 
  } catch (error) {
    next(error)
  }
}