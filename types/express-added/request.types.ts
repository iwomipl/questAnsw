import { Request } from 'express'
import { Question } from '../repositories'

export interface RequestCustom extends Request {
  repositories?: {questionRepo: Question};
}