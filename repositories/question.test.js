const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')
const { ValidationError } = require('../utils/errors')

const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
const uuid = faker.datatype.uuid()
let questionRepo
let testQuestions
let testQuestion

beforeAll(async () => {
  await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
  questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  testQuestion = [
    {
      id: uuid,
      summary: 'What is my name?',
      author: 'Jack London',
      answers: [{
        'id': 'd498b0a4-6be3-4354-a3bc-87673aca0f31',
        'author': 'Mr Fantastic',
        'summary': 'Lack Jondon.'
      }]
    }
  ]

  testQuestions = [
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
})

afterAll(async () => {
  await rm(TEST_QUESTIONS_FILE_PATH)
})

describe('questions in question repository', () => {

  /**-----------------------  getQuestions  -----------------------------*/
  test('getQuestions() should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('getQuestionById() should return 0 question', async () => {
    const testedQuestion = await questionRepo.getQuestionById(uuid)
    expect(testedQuestion).toHaveLength(0)
  })

  test('getQuestions() should return a list of 2 questions', async () => {

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const questions = await questionRepo.getQuestions()

    expect(questions).toHaveLength(2)
    expect(questions).toEqual(expect.objectContaining(questions))
  })


  test('getQuestionById() should return 1 question that is the same question', async () => {
    const testedQuestion = await questionRepo.getQuestionById(uuid)

    expect(testedQuestion).toHaveLength(1)
    expect(testedQuestion).toEqual(expect.objectContaining(testedQuestion))
  })

  test('getQuestionById() should throw an Error if have no arguments', async () => {
    await expect(async () => await questionRepo.getQuestionById()).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('getQuestionById() should throw an Error if id is not uuid', async () => {
    const questionID = 'random-gibberish'
    await expect(async () => await questionRepo.getQuestionById(questionID)).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  /**-----------------------  addQuestions  -----------------------------*/

  /*Author argument validation*/

  test('addQuestion() should throw an Error if "author" argument is to short', async () => {
    await expect(async () => await questionRepo.addQuestion('a', 'Is It?')).rejects.toThrow(new ValidationError('Author\'s credentials should be between 2 and 50 letters long. Fix it and send Your question again.'))
  })

  test('addQuestion() should throw an Error if "author" argument is to long', async () => {
    await expect(async () => await questionRepo.addQuestion(Array(51).fill('a', 0, 51).join('').length, 'Is It?'))
      .rejects.toThrow(new ValidationError('Author\'s credentials should be between 2 and 50 letters long. Fix it and send Your question again.'))
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

  /* Question argument validation */

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

  test('getQuestion() should return testQuestion after adding and reading it back from the file', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestion))

    const addedQuestion = await questionRepo.getQuestionById(uuid)

    expect(addedQuestion).toHaveLength(1)
    expect(addedQuestion).toEqual(expect.objectContaining(testQuestion))
  })

})

describe('answers in question repository', () => {

  /**-----------------------  getAnswers  -----------------------------*/
  test('getAnswers() should throw an Error if have no arguments', async () => {
    await expect(async () => await questionRepo.getAnswers()).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('getAnswers() should throw an Error if id is not uuid', async () => {
    const questionID = 'random-gibberish'
    await expect(async () => await questionRepo.getAnswers(questionID)).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('getAnswers() should throw an Error if "questionID" argument is undefined', async () => {
    await expect(async () => await questionRepo.getAnswers(undefined)).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('getAnswers() should throw an Error if "questionId" argument is null', async () => {
    await expect(async () => await questionRepo.getAnswers(null)).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('getAnswers() should throw an Error if "questionId" argument is Boolean', async () => {
    await expect(async () => await questionRepo.getAnswers(Boolean(Math.round(Math.random() * 0.5))).rejects.toThrow(new ValidationError('Sorry, this is not UUID.')))
  })

  test('getAnswers() should throw an Error if "questionId" argument is Number', async () => {
    await expect(async () => await questionRepo.getAnswers(Math.round(Math.random() * 105.5))).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('getQuestion() should return testQuestion after adding and reading it back from the file', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestion))

    const addedQuestion = await questionRepo.getQuestionById(uuid)

    expect(addedQuestion).toHaveLength(1)
    expect(addedQuestion).toEqual(expect.objectContaining(testQuestion))
  })


  test('getAnswers() should return testQuestion\'s answers', async () => {

    const gotAnswers = await questionRepo.getAnswers(uuid)
    const answers = [{
      'id': 'd498b0a4-6be3-4354-a3bc-87673aca0f31',
      'author': 'Mr Fantastic',
      'summary': 'Lack Jondon.'
    }]

    expect(gotAnswers).toHaveLength(1)
    expect(gotAnswers).toEqual(expect.objectContaining(answers))
  })


  /**-----------------------  addAnswers  -----------------------------*/


})
