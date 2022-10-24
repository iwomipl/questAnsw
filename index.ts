import makeApp from './server'
import { STORAGE_FILE_PATH, PORT } from './config/config'

let app = makeApp(STORAGE_FILE_PATH)

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})


