import { readFile, writeFile } from 'fs/promises'
import { v4 as uuid } from 'uuid'
import { ValidationError } from '../utils/errors'
import { uuidValidator, questionValidator, authorValidator, answerValidator } from '../utils/validators'
import { Answer, IdObject, Question, QuestionResponse } from '../types/'

export const makeQuestionRepository = (fileName: string): Question => {
  const getQuestions = async (): Promise<QuestionResponse[]> => {
    try {
      const fileContent = await readFile(fileName, { encoding: 'utf-8' })
      const questions: QuestionResponse[] = JSON.parse(fileContent)

      return questions
    } catch (err) {
      throw new Error('Could not get questions.')
    }
  }

  const getQuestionById = async (questionId: string): Promise<QuestionResponse[]> => {
    try {
      if (uuidValidator(questionId)) {
        const fileContent = await readFile(fileName, { encoding: 'utf-8' })
        const question: QuestionResponse[] = JSON.parse(fileContent).filter((el: QuestionResponse) => el.id === questionId)

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
  const addQuestion = async (authorString: string, questionString: string): Promise<IdObject> => {
    try {
      const summary = questionValidator(questionString)
      const author = authorValidator(authorString)
      let questions = await getQuestions()
      let id: string

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
  const getAnswers = async (questionId: string): Promise<Answer[]> => {
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
  const getAnswer = async (questionId: string, answerId: string): Promise<Answer[]> => {
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
  const addAnswer = async (questionId: string, answerString: string, authorString: string): Promise<IdObject> => {
    try {
      if (uuidValidator(questionId)) {
        const summary = answerValidator(answerString)
        const author = authorValidator(authorString)
        const answers = await getAnswers(questionId)
        let id: string

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
