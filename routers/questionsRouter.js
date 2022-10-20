const { Router } = require('express')
const { v4 } = require('uuid')

const questionsRouter = Router()

questionsRouter
  .get('/', async (req, res) => {
    const questions = await req.repositories.questionRepo.getQuestions()
    res.json(questions)
  })
  .get('/:questionId', async (req, res) => {
    const { questionId } = req.params

    const question = await req.repositories.questionRepo.getQuestionById(questionId)

    question.length ?
      res.json(question) :
      res.json({ message: 'Sorry, could not find question with given ID!' }).status(204)
  })

  .post('/', (req, res) => {

  })

  .get('/:questionId/answers', (req, res) => {
  })

  .post('/:questionId/answers', (req, res) => {
  })

  .get('/:questionId/answers/:answerId', (req, res) => {
    const { questionId, answerId } = req.params

    res.json({ questionId, answerId })
  })

module.exports = {
  questionsRouter
}