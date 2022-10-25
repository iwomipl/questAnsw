const { readFile, writeFile } = require('fs/promises')
const { v4: uuid } = require('uuid')
const { ValidationError } = require('../utils/errors')
const { uuidValidator, questionValidator, authorValidator, answerValidator } = require('../utils/validators')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    try {
      const fileContent = await readFile(fileName, { encoding: 'utf-8' })
      const questions = JSON.parse(fileContent)

      return questions
    } catch (err) {
      throw new Error('Could not get questions.')
    }
  }

  const getQuestionById = async questionId => {
    try {
      if (uuidValidator(questionId)) {
        const fileContent = await readFile(fileName, { encoding: 'utf-8' })
        const question = JSON.parse(fileContent).filter(el => el.id === questionId)

        return question
      }
      throw new Error('Could not get questions')
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new ValidationError(err.message)
      }
      throw new Error(err.message)
    }
  }
  const addQuestion = async (authorString, questionString) => {
    try {
      const summary = questionValidator(questionString)
      const author = authorValidator(authorString)
      let questions = await getQuestions()
      let id

      //check if question with this id exists and changing it in this case
      do {
        id = uuid()
      } while (questions.filter(el => el.id === id).length !== 0)


      questions = [...questions, {
        id,
        author,
        summary,
        answers: []
      }]

      await writeFile(fileName, JSON.stringify(questions))

      return { id }
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new ValidationError(err.message)
      }
      throw new Error(err.message)
    }

  }
  const getAnswers = async questionId => {
    try {
      if (uuidValidator(questionId)) {
        const [{ answers }] = await getQuestionById(questionId)

        return answers
      }
      throw new Error('Could not get answers.')
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new ValidationError(err.message)
      }
      throw new Error(err.message)
    }
  }
  const getAnswer = async (questionId, answerId) => {
    try {
      if (uuidValidator(questionId) && uuidValidator(answerId)) {
        const [{ answers }] = await getQuestionById(questionId)

        return answers.filter(el => el.id === answerId)
      }
      throw new Error('Could not get answers.')
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new ValidationError(err.message)
      }
      throw new Error(err.message)
    }
  }
  const addAnswer = async (questionId, answerString, authorString) => {
    try {
      if (uuidValidator(questionId)) {
        const summary = answerValidator(answerString)
        const author = authorValidator(authorString)
        const answers = await getAnswers(questionId)
        let id

        //check if answer with this id exists and changing it in this case
        do {
          id = uuid()
        } while (answers.filter(el => el.id === id).length !== 0)

        let questions = await getQuestions()

        questions = questions.reduce((prev, curr) => {
          if (curr.id === questionId) {
            return [...prev, {
              ...curr,
              answers: [...curr.answers, {
                id,
                author,
                summary
              }]
            }]
          }
          return [...prev, curr]
        }, [])

        await writeFile(fileName, JSON.stringify(questions))

        return { id }
      }
      throw new Error('Could not add answer.')
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new ValidationError(err.message)
      }
      throw new Error(err.message)
    }
  }


  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
