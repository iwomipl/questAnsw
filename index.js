const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')
const { handleFourOhFourError, handleError } = require('./utils/errors')
const { routes } = require('./routers/routes')
const { PORT, STORAGE_FILE_PATH } = require('./config/config')

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

//Routers
app.use(routes)

//errors
app.use(handleError)
//404 error
app.use(handleFourOhFourError)

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})

