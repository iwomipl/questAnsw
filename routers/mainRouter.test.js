const request = require('supertest')
const { TEST_QUESTIONS_FILE_PATH } = require('../config/config')
const makeApp = require('../server')

let mainRouterResponseBody
let testedApp

beforeAll(async () => {
  testedApp = makeApp(TEST_QUESTIONS_FILE_PATH)

  mainRouterResponseBody = { message: 'Welcome to responder!' }
})

afterAll(async () => {
  testedApp = null

})

describe('mockup '/' path test of good response', () => {
  test('s', async () => {

    const res = await request(testedApp)
      .get('/').set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toEqual(expect.objectContaining(mainRouterResponseBody))
  })
})