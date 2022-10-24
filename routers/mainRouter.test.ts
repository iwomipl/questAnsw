import request from 'supertest'
import { TEST_QUESTIONS_FILE_PATH } from '../config/config'
import makeApp from '../server'
import { MainRouterResponseBody } from './mainRouter'

let mainRouterResponseBody: MainRouterResponseBody
let testedApp = makeApp(TEST_QUESTIONS_FILE_PATH)

beforeAll(async () => {
  mainRouterResponseBody = { message: 'Welcome to responder!' }
})

afterAll(async () => {
  testedApp = null

})

describe(`mockup '/' path test of good response`, () => {
  test('s', async () => {

    const res = await request(testedApp)
      .get('/').set('Accept', 'application/json')

    expect(res.statusCode).toEqual(200)
    expect(res.headers['content-type'] as string).toMatch(/json/)
    expect(res.body as MainRouterResponseBody).toEqual(expect.objectContaining(mainRouterResponseBody))
  })
})