const makeApp = require('./server')
const { STORAGE_FILE_PATH, PORT } = require('./config/config')

let app = makeApp(STORAGE_FILE_PATH)

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})


