const { Router } = require('express')
const { mainRouter } = require('./mainRouter')
const { questionsRouter } = require('./questionsRouter')

const routes = Router()

routes
  .use(`/questions`, questionsRouter)
  .use(`/`, mainRouter)

module.exports = {
  routes
}
