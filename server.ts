import express from 'express'
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')
const { handleFourOhFourError, handleError } = require('./utils/errors')
const { routes } = require('./routers/routes')

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
