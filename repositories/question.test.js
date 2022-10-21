const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')
const { ValidationError } = require('../utils/errors')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  const uuid = faker.datatype.uuid()
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })
  /**-----------------------  getQuestions  -----------------------------*/
  test('getQuestions() should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('getQuestionById() should return 0 question', async () => {
    const testedQuestion = await questionRepo.getQuestionById(uuid)
    expect(testedQuestion).toHaveLength(0)
  })

  test('getQuestions() should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: uuid,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })


  test('getQuestionById() should return 1 question', async () => {
    const testedQuestion = await questionRepo.getQuestionById(uuid)

    expect(testedQuestion).toHaveLength(1)
    expect(testedQuestion).toEqual(expect.objectContaining([{
      id: uuid,
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    }]))
  })

  test('getQuestionById() should throw an Error if have no arguments', async () => {
    await expect(async () => await questionRepo.getQuestionById()).rejects.toThrow(ValidationError)
  })

  test('getQuestionById() should throw an Error if id is not uuid', async () => {
    const questionID = 'random-gibberish'
    await expect(async () => await questionRepo.getQuestionById(questionID)).rejects.toThrow(ValidationError)
  })

  /**-----------------------  addQuestions  -----------------------------*/

  //Author argument validation--------------------------------------------
  test('addQuestion() should throw an Error if "author" argument is to short', async () => {
    await expect(async () => await questionRepo.addQuestion('a', 'Is It?')).rejects.toThrow('Auhtor\'s credentials should be between 2 and 50 letters long. Fix it and send Your question again.')
  })

  test('addQuestion() should throw an Error if "author" argument is to long', async () => {
    await expect(async () => await questionRepo.addQuestion(Array(51).fill('a', 0, 51).join('').length, 'Is It?'))
      .rejects.toThrow('Auhtor\'s credentials should be between 2 and 50 letters long. Fix it and send Your question again.')
  })

  test('addQuestion() should throw an Error if "author" argument is undefined', async () => {
    await expect(async () => await questionRepo.addQuestion(undefined, 'Is It?')).rejects.toThrow(ValidationError)
  })

  test('addQuestion() should throw an Error if "author" argument is null', async () => {
    await expect(async () => await questionRepo.addQuestion(null, 'Is It?')).rejects.toThrow(ValidationError)
  })

  test('addQuestion() should throw an Error if "author" argument is Boolean', async () => {
    await expect(async () => await questionRepo.addQuestion(Boolean(Math.round(Math.random() * 0.5)), 'Is It?')).rejects.toThrow(ValidationError)
  })

  test('addQuestion() should throw an Error if "author" argument is Number', async () => {
    await expect(async () => await questionRepo.addQuestion(Math.round(Math.random() * 105.5), 'Is It?')).rejects.toThrow(ValidationError)
  })


  //Question argument validation----------------------------------------------
  test('addQuestion() should throw an Error if "question" argument does Not have question mark at the end', async () => {
    await expect(async () => await questionRepo.addQuestion('author', 'ttt')).rejects.toThrow('All questions should have question mark at the end My Friend. Fix it and send Your question again.')
  })

  test('addQuestion() should throw an Error if "question" argument is to short', async () => {
    await expect(async () => await questionRepo.addQuestion('author', 't?')).rejects.toThrow('Question be between 3 and 150 characters long. Fix it and send Your question again.')
  })

  test('addQuestion() should throw an Error if "question" argument is to long', async () => {
    await expect(async () => await questionRepo.addQuestion('author', `${Array(150).fill('a', 0, 150).join('')}?`))
      .rejects.toThrow('Question be between 3 and 150 characters long. Fix it and send Your question again.')
  })

  test('addQuestion() should throw an Error if "question" argument is undefined', async () => {
    await expect(async () => await questionRepo.addQuestion('author', undefined)).rejects.toThrow(ValidationError)
  })

  test('addQuestion() should throw an Error if "question" argument is null', async () => {
    await expect(async () => await questionRepo.addQuestion('author', null)).rejects.toThrow(ValidationError)
  })

  test('addQuestion() should throw an Error if "question" argument is Boolean', async () => {
    await expect(async () => await questionRepo.addQuestion('author', Boolean(Math.round(Math.random() * 0.5))).rejects.toThrow(ValidationError))
  })

  test('addQuestion() should throw an Error if "question" argument is Number', async () => {
    await expect(async () => await questionRepo.addQuestion('author', Math.round(Math.random() * 105.5))).rejects.toThrow(ValidationError)
  })


  /**-----------------------  getAnswers  -----------------------------*/


  /**-----------------------  addAnswers  -----------------------------*/


})
