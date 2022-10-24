import { Router } from 'express'
import { RequestCustom } from '../types'

export const mainRouter = Router()

mainRouter
  .get('/', (req: RequestCustom, res) => {
    res.json({ message: 'Welcome to responder!' })
  })
