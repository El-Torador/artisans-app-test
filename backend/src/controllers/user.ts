import { RequestHandler } from "express"
import createHttpError from "http-errors"
import bcrypt from "bcrypt"

import User, { UserModel } from "../models/User"

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId

  try {
    if (!authenticatedUserId) throw createHttpError(401, "User not authenticated.")
    const user = await User.findById(authenticatedUserId).select("+email").exec()
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const register: RequestHandler = async (req, res, next) => {
  const { username, email, password } = req.body as unknown as UserModel

  try {
    if (!username || !email || !password) throw createHttpError(400, "Missing parameters.")

    const existingUser = await User.findOne({ email }).exec()
    if(existingUser) throw createHttpError(409, "User already exists.")

    const passwordHashed = await bcrypt.hash(password, 10)
    const userData = {
      username, email, password: passwordHashed
    }
    const newUser = new User(userData)
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
}

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body as { email: string, password: string }

  try {
    if (!email || !password) throw createHttpError(400, "Missing parameters.")

    const user = await User.findOne({ email }).select("+password +username").exec()
    if (!user) throw createHttpError(401, "Invalid credentials")

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) throw createHttpError(401, "Invalid credentials.")

    req.session.userId = user._id
    
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}


export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy(error => {
    if (error) next(error)
    else res.status(200).json(null)
  })
}