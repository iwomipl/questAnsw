const request = require('supertest')
const { writeFile, rm } = require('fs/promises')
const { TEST_QUESTIONS_FILE_PATH } = require('../config/config')
const makeApp = require('../server')

let testedApp
let listOfQuestions
let doesNotHaveAnswersId
let haveAnswersId
let haveAnswersAuthor
let haveAnswersSummary
let haveAnswersAnswerArray
let haveAnswersAnswerOne
let haveAnswersAnswerTwo


beforeAll(async () => {
  testedApp = makeApp(TEST_QUESTIONS_FILE_PATH)
  haveAnswersId = '50f9e662-fa0e-4ec7-b53b-7845e8f821c3'
  haveAnswersAuthor = 'John Stockton'
  haveAnswersSummary = 'What is the shape of the Earth?'
  haveAnswersAnswerOne = {
    'id': 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
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

describe('mockup "/questions" path test', () => {
  test('Working \'/questionPath returns expected data', async () => {

    const res = await request(testedApp).get('/questions')

    expect(res.statusCode).toEqual(200)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body).toEqual(expect.objectContaining(listOfQuestions))
  })

  test('"/questions" path withe method POST returns  returns expected data', async () => {
    const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    const author = 'Captain Obvious'
    const summary = 'Do I exist?'
    const res = await request(testedApp)
      .post(`/questions`)
      .send({ author, summary })

    expect(res.body).toHaveProperty('id', expect.stringMatching(regex))
    expect(res.statusCode).toEqual(201)
    expect(res.headers['content-type']).toMatch(/json/)
  })

  test('"/questions" path withe method POST returns error', async () => {
    const res = await request(testedApp).post(`/questions`)


    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type']).toMatch(/json/)
  })
})

describe('mockup "/questions" path test of good response', () => {
  test('\'/wrong\' path returns 404 status and error info', async () => {

    const res = await request(testedApp).get('/wrong')

    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body).toEqual(expect.objectContaining({ error: "Not found" }))
  })
})

describe('mockup "/questions/:questionId" path test of good response', () => {
  test('Working "/questions/:questionId" path returns expected data', async () => {
    const res = await request(testedApp).get(`/questions/${haveAnswersId}`)

    expect(res.statusCode).toEqual(200)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body).toEqual(expect.objectContaining([listOfQuestions[0]]))
  })
})

describe('mockup "/questions/:questionId" path test of good response', () => {
  test('"/questions/:questionId" path returns expected data', async () => {
    const res = await request(testedApp).get(`/questions/sdfsdf`)

    expect(res.statusCode).toEqual(404)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body).toEqual(expect.objectContaining([{"error": {"message": "Sorry, this is not UUID."}}]))
  })
})

