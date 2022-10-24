import { NextFunction, Response } from 'express'
import { Question, RequestCustom } from '../types/repositories/question/question.types'

const { makeQuestionRepository } = require('../repositories/question')

export const makeRepositories = (fileName: string) => (req: RequestCustom, res:  Response, next: NextFunction) => {
  req.repositories = { questionRepo: makeQuestionRepository(fileName) as Question};
  next()
}
