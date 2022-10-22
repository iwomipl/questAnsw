class ValidationError extends Error {
}

const handleError = (err, req, res, next) => {
  console.error(err)

  res.status(err instanceof ValidationError ? 400 : 500)
    .json([{
      message: err instanceof ValidationError ? err.message : `We're sorry, try again later.`
    }])

}

const handleFourOhFourError = (req, res, next) => {

  res.status(404)
    .json([{ error: 'Not found' }])
}

module.exports = {
  ValidationError,
  handleError,
  handleFourOhFourError
}