import { Router } from 'express'
import { mainRouter } from './mainRouter'
import { questionsRouter } from './questionsRouter'

export const routes = Router()

routes
  .use(`/questions`, questionsRouter)
  .use(`/`, mainRouter)