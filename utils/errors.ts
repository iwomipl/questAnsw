import { NextFunction, Response } from 'express'
import { RequestCustom } from '../types'

export class ValidationError extends Error {
}

export const handleError = (err: Error, req: RequestCustom, res: Response, next: NextFunction) => {
  console.error(err)

  res.status(err instanceof ValidationError ? 400 : 500)
    .json([{
      message: err instanceof ValidationError ? err.message : `We're sorry, try again later.`
    }])

}

export const handleFourOhFourError = (req: RequestCustom, res: Response, next: NextFunction) => {

  res.status(404)
    .json([{ error: 'Not found' }])
}
