const { ValidationError } = require('./errors')

const uuidValidator = (uuid) => {
  const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/

  if (!regex.test(uuid)) {
    throw new ValidationError('Sorry, this is not UUID.')
  }

  return true
}

const questionValidator = (questionString) => {
  const regex = /\?$/

  if (typeof questionString !== 'string' || !regex.test(questionString)) {
    throw new ValidationError('All questions should have question mark at the end My Friend. Fix it and send Your question again.')
  }

  if (questionString.length < 3 || questionString.length > 150) {
    throw new ValidationError('Question be between 3 and 150 characters long. Fix it and send Your question again.')
  }

  return questionString
}

const answerValidator = (answerString) => {

  if (typeof answerString !== 'string' || answerString.length < 3 || answerString.length > 150) {
    throw new ValidationError('Answer should be string between 3 and 150 characters long. Fix it and send Your question again.')
  }

  return answerString
}

const authorValidator = (author) => {
  if (typeof author !== 'string' || !author || author.length < 2 || author.length > 50) {
    throw new ValidationError('Author\'s credentials should be between 2 and 50 letters long. Fix it and send Your question again.')
  }

  return author
}

module.exports = {
  uuidValidator,
  questionValidator,
  authorValidator,
  answerValidator
}