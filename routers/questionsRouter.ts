import { Router } from 'express'
import { RequestCustom } from '../types'

export const questionsRouter = Router()

export type ThisIsError = [
  { error: { message: string } }
]

export interface DataToGetFromRequest {
  author: string;
  summary: string;
}

questionsRouter
  .get('/', async (req: RequestCustom, res) => {
    try {
      const { getQuestions } = req.repositories.questionRepo
      const questions = await getQuestions()

      res.json(questions)
    } catch (err) {
      res.status(404).json([{ error: { message: err.message } }])
    }
  })
  .post('/', async (req: RequestCustom, res) => {
    try {
      const { author, summary }: DataToGetFromRequest = req.body
      const { addQuestion } = req.repositories.questionRepo
      const addedQuestionId = await addQuestion(author, summary)

      res.status(201).json(addedQuestionId)
    } catch (err) {
      res.status(404).json([{ error: { message: err.message } }] as ThisIsError)
    }
  })
  .get('/:questionId', async (req: RequestCustom, res) => {
    try {
      const { getQuestionById } = req.repositories.questionRepo
      const { questionId } = req.params

      const question = await getQuestionById(questionId)

      !!question.length ?
        res.json(question) :
        res.status(404).json(question)
    } catch (err) {
      res.status(404).json([{ error: { message: err.message } }] as ThisIsError)
    }
  })
  .get('/:questionId/answers', async (req: RequestCustom, res) => {
    try {
      const { getAnswers } = req.repositories.questionRepo
      const { questionId } = req.params

      const answers = await getAnswers(questionId)

      !!answers.length ?
        res.json(answers) :
        res.status(404).json(answers)
    } catch (err) {
      res.status(404).json([{ error: { message: err.message } }] as ThisIsError)
    }
  })

  .post('/:questionId/answers', async (req: RequestCustom, res) => {
    try {
      const { addAnswer } = req.repositories.questionRepo
      const { questionId } = req.params
      const { author, summary }: DataToGetFromRequest = req.body

      const id = await addAnswer(questionId, summary, author)

      res.status(201).json(id)
    } catch (err) {
      res.status(404).json([{ error: { message: err.message } }] as ThisIsError)
    }
  })

  .get('/:questionId/answers/:answerId', async (req: RequestCustom, res) => {
    try {
      const { getAnswer } = req.repositories.questionRepo
      const { questionId, answerId } = req.params

      const answer = await getAnswer(questionId, answerId)


      res.json(answer)
    } catch (err) {
      res.status(404).json([{ error: { message: err.message } }] as ThisIsError)
    }
  })
