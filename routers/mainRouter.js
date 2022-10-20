const { Router } = require('express')

const mainRouter = Router()

mainRouter
  .get('/', (_, res) => {
    res.json({ message: 'Welcome to responder!' })
  })

module.exports = {
  mainRouter
}