const express = require('express')
const { urlencoded, json } = require('body-parser')
require('express-async-errors')
const makeRepositories = require('./middleware/repositories')
const { handleFourOhFourError, handleError } = require('./utils/errors')
const { routes } = require('./routers/routes')

function app(fileName) {
  const app = express()

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

module.exports = app