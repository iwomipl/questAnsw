import express from 'express'
import { urlencoded, json } from 'body-parser'
import { makeRepositories } from './middleware/repositories'
import { handleFourOhFourError, handleError } from './utils/errors'
import { routes } from './routers/routes'

export default function app(fileName: string) {
  const app = express()

  //Middleware
  app.use(urlencoded({ extended: true }))
  app.use(json())
  app.use(makeRepositories(fileName))

//Routers
  app.use(routes)

//errors
  app.use(handleError)
//404 error
  app.use(handleFourOhFourError)

  return app
}
