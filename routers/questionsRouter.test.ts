import request from 'supertest'
import { writeFile, rm } from 'fs/promises'
import { faker } from '@faker-js/faker'
import { TEST_QUESTIONS_FILE_PATH } from '../config/config'
import makeApp  from '../server'
import { Answer, QuestionResponse } from '../types'


let testedApp = makeApp(TEST_QUESTIONS_FILE_PATH)
let listOfQuestions: QuestionResponse[]
let doesNotHaveAnswersId: string
let haveAnswersId: string
let haveAnswersAuthor: string
let haveAnswersSummary: string
let haveAnswersAnswerArray: Answer[]
let haveAnswersAnswerOne: Answer
let haveAnswersAnswerTwo: Answer
let oneAnswersId: string

type NotFound = [
  { error: string }
]


beforeAll(async () => {

  haveAnswersId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3'
  haveAnswersAuthor = 'John Stockton'
  haveAnswersSummary = 'What is the shape of the Earth?'
  oneAnswersId = 'ce7bddfb-0544-4b14-92d8-188b03c41ee4'
  haveAnswersAnswerOne = {
    'id': oneAnswersId,
    'author': 'Brian McKenzie',
    'summary': 'The Earth is flat.'
  }
  haveAnswersAnswerTwo = {
    'id': 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
    'author': 'Dr Strange',
    'summary': 'It is egg-shaped.'
  }
  haveAnswersAnswerArray = [haveAnswersAnswerOne, haveAnswersAnswerTwo]
  doesNotHaveAnswersId = '00f3dd43-ae53-4430-8da1-b722e034c73d'


  listOfQuestions = [{
    'id': haveAnswersId,
    'author': haveAnswersAuthor,
    'summary': haveAnswersSummary,
    'answers': haveAnswersAnswerArray
  },
    {
      'id': doesNotHaveAnswersId,
      'author': 'Sarah Nickle',
      'summary': 'Who let the dogs out?',
      'answers': []
    }]

  await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(listOfQuestions))
})

afterAll(async () => {
  testedApp = null
  await rm(TEST_QUESTIONS_FILE_PATH)
})

describe('mockup "/wrong" path test of good response', () => {
  test('Erroneous "/randomText" path method GET returns 404 status and error info', async () => {

    const res = await request(testedApp).get(`/${faker.datatype.uuid().slice(10)}`)

    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type'] as string).toMatch(/json/)
    expect(res.body as NotFound).toEqual(expect.objectContaining([{ error: 'Not found' }]))
  })

  test('Erroneous "/randomText" path method POST returns 404 status and error info', async () => {

    const res = await request(testedApp).post(`/${faker.datatype.uuid().slice(10)}`)

    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type'] as string).toMatch(/json/)
    expect(res.body as NotFound).toEqual(expect.objectContaining([{ error: 'Not found' }]))
  })
})

describe('mockup "/questions" path test', () => {

  test('Working "/questions" path, method GET returns expected data', async () => {

    const res = await request(testedApp).get('/questions')

    expect(res.statusCode).toEqual(200)
    expect(res.headers['content-type'] as string).toMatch(/json/)
    expect(res.body as QuestionResponse[]).toEqual(expect.objectContaining(listOfQuestions))
  })

  test('Working "/questions" path, method POST returns  returns expected data', async () => {
    const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    const author = 'Captain Obvious'
    const summary = 'Do I exist?'
    const res = await request(testedApp)
      .post(`/questions`)
      .send({ author, summary })

    expect(res.body as {id: string}).toHaveProperty('id', expect.stringMatching(regex))
    expect(res.statusCode).toEqual(201)
    expect(res.headers['content-type'] as string).toMatch(/json/)
  })

  test('Erroneous "/questions" path withe method POST returns error', async () => {
    const res = await request(testedApp).post(`/questions`)


    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type'] as string).toMatch(/json/)
  })
})

describe('mockup "/questions/:questionId" path test of good response', () => {
  test('Working "/questions/:questionId" path method GET returns expected data', async () => {
    const res = await request(testedApp).get(`/questions/${haveAnswersId}`)

    expect(res.statusCode).toEqual(200)
    expect(res.headers['content-type'] as string).toMatch(/json/)
    expect(res.body as QuestionResponse[]).toEqual(expect.objectContaining([listOfQuestions[0]]))
  })

  test('"/questions/:questionId" path returns Error', async () => {
    const res = await request(testedApp).get(`/questions/sdfsdf`)

    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type'] as string).toMatch(/json/)
  })
})

describe('mockup "/questions/:questionId/answers" path test of good response', () => {
  test('Working "/questions/:questionId/answers" path method GET returns expected data', async () => {
    const res = await request(testedApp).get(`/questions/${haveAnswersId}/answers`)

    expect(res.statusCode).toEqual(200)
    expect(res.headers['content-type'] as string).toMatch(/json/)
    expect(res.body as Answer).toEqual(expect.objectContaining(haveAnswersAnswerArray))
  })

  test('"/questions/:questionId/answer" path method GET returns Error', async () => {
    const res = await request(testedApp).get(`/questions/surely-non-existing-as-uuid/answers`)

    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type'] as string).toMatch(/json/)
  })

  test('Working "/questions/:questionId/answers" path method POST returns expected data', async () => {
    const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    const author = 'I am To Be'
    const summary = 'I am To Be! Source of all existence!'
    const res = await request(testedApp)
      .post(`/questions/${doesNotHaveAnswersId}/answers`)
      .send({ author, summary })

    expect(res.statusCode).toEqual(201)
    expect(res.headers['content-type'] as string).toMatch(/json/)
    expect(res.body as {id: string}).toHaveProperty('id', expect.stringMatching(regex))
  })

  test('"/questions/:questionId/answer" path method POST returns Error', async () => {
    const res = await request(testedApp).post(`/questions/${faker.datatype.uuid()}/answers`)

    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type'] as string).toMatch(/json/)
  })
})

describe('mockup "/questions/:questionId/answers/:answerId" path test of good response', () => {
  test('Working "/questions/:questionId/answers/:answerId" path method GET returns expected data', async () => {
    const res = await request(testedApp).get(`/questions/${haveAnswersId}/answers/${oneAnswersId}`)

    expect(res.statusCode).toEqual(200)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body as Answer).toEqual(expect.objectContaining([haveAnswersAnswerOne]))
  })

  test('"/questions/:questionId/answers/:answerId" path returns Error', async () => {
    const res = await request(testedApp).get(`/questions/:questionId/answers/some-gibberish`)

    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type'] as string).toMatch(/json/)
  })
  test('"/questions/:questionId/answers/:answerId" path returns Error', async () => {
    const res = await request(testedApp).get(`/questions/even-more-gibberish/answers/:answerId`)

    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type'] as string).toMatch(/json/)
  })
})