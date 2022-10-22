const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')
const { ValidationError } = require('../utils/errors')
const { TEST_QUESTIONS_FILE_PATH } = require('../config/config')

const uuid = faker.datatype.uuid()
const uuidAnswer = 'd498b0a4-6be3-4354-a3bc-87673aca0f31'
let questionRepo
let testQuestions
let testQuestion
let testQuestionSummary
let testQuestionAuthor
let testQuestionAnswer
let testQuestionAnswerArray
let thirdArgument = 'Is it?'
const badCaseSolutions = [
  ['addQuestion() should throw an Error if "author" argument is to short', '?', thirdArgument],
  ['addQuestion() should throw an Error if "author" argument is to long', Array(151).fill('?', 0, 151).join(''), thirdArgument],
  ['addQuestion() should throw an Error if "author" argument is undefined', undefined, thirdArgument],
  ['addQuestion() should throw an Error if "author" argument is null', null, thirdArgument],
  ['addQuestion() should throw an Error if "author" argument is Boolean', Boolean(Math.round(Math.random() * 0.5)), thirdArgument],
  ['addQuestion() should throw an Error if "author" argument is Number', 111, thirdArgument]
]

beforeAll(async () => {
  await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
  questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  testQuestionSummary = 'What is my name?'
  testQuestionAuthor = 'Jack London'
  testQuestionAnswer = {
    'id': uuidAnswer,
    'author': 'Mr Fantastic',
    'summary': 'Lack Jondon.'
  }
  testQuestionAnswerArray = [testQuestionAnswer]

  testQuestion = [
    {
      id: uuid,
      summary: testQuestionSummary,
      author: testQuestionAuthor,
      answers: testQuestionAnswerArray
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
  describe('getQuestions and getQuestion in question repository', () => {

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
  })

  /**-----------------------  addQuestions  -----------------------------*/
  describe('addQuestion in question repository', () => {
    const adQuestionAuthorValidation = JSON.parse(JSON.stringify(badCaseSolutions))
    adQuestionAuthorValidation.forEach(el => {
      test(el[0], async () => {
        await expect(async () => await questionRepo.addQuestion(el[1], el[2])).rejects.toThrow(new ValidationError('Author\'s credentials should be between 2 and 50 letters long. Fix it and send Your question again.'))
      })
    })


    /* Question argument validation */
    const questionCheckerThirdArgument = 'author'
    const adQuestionQuestionValidation = JSON.parse(JSON.stringify(badCaseSolutions))

    const questionChecker = adQuestionQuestionValidation.map(async el => {
      el[0] = el[0].replace('author', 'question')
      el[2] = questionCheckerThirdArgument
      return el
    })

    questionChecker.forEach(el => {
      test(el[0], async () => {
        await expect(async () => await questionRepo.addQuestion(el[2], el[1])).rejects.toThrow(ValidationError)
      })
    })

    test('addQuestion() should throw an Error if "question" argument does Not have question mark at the end', async () => {
      await expect(async () => await questionRepo.addQuestion('author', 'ttt')).rejects.toThrow('All questions should have question mark at the end My Friend. Fix it and send Your question again.')
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
    describe('getAnswers and getAnswer in question repository', () => {

      test('getAnswers() should throw an Error if have no arguments', async () => {
        await expect(async () => await questionRepo.getAnswers()).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
      })

      test('getAnswers() should throw an Error if id is not uuid', async () => {
        const questionID = 'random-gibberish'
        await expect(async () => await questionRepo.getAnswers(questionID)).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
      })

      const getAnswersQuestionValidation = JSON.parse(JSON.stringify(badCaseSolutions))

      const getAnswersChecker = getAnswersQuestionValidation.map(async el => {
        el[0] = el[0].replace('addQuestion', 'getAnswers')
        el[0] = el[0].replace('author', 'questionID')

        return el
      })

      getAnswersChecker.forEach(el => {
        test(el[0], async () => {
          await expect(async () => await questionRepo.getAnswers(el[1])).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
        })
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
    })

    /**-----------------------  getAnswer  -----------------------------*/
    describe('getAnswer() in question repository', () => {

      /*questionId argument validation*/
      const getAnswerQuestionIdValidation = JSON.parse(JSON.stringify(badCaseSolutions))

      const getAnswerQuestionIdChecker = getAnswerQuestionIdValidation.map(async el => {
        el[0] = el[0].replace('addQuestion', 'getAnswer')
        el[0] = el[0].replace('author', 'questionId')
        el[2] = uuidAnswer

        return el
      })
      getAnswerQuestionIdChecker.forEach(el => {
        test(el[0], async () => {
          await expect(async () => await questionRepo.getAnswer(el[1], el[2])).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
        })

      })

      /* answerId argument validation */
      const getAnswerAnswerIdValidation = JSON.parse(JSON.stringify(badCaseSolutions))

      const getAnswerAnswerIdChecker = getAnswerAnswerIdValidation.map(async el => {
        el[0] = el[0].replace('addQuestion', 'getAnswer')
        el[0] = el[0].replace('author', 'answerId')
        el[2] = uuid

        return el
      })

      getAnswerAnswerIdChecker.forEach(el => {
        test(el[0], async () => {
          await expect(async () => await questionRepo.getAnswer(el[2], el[1])).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
        })
      })

      test('getAnswer() should return testQuestion after adding and reading it back from the file', async () => {

        const answer = await questionRepo.getAnswer(uuid, uuidAnswer)

        expect(answer).toHaveLength(1)
        expect(answer).toEqual(expect.objectContaining(testQuestionAnswerArray))
      })
    })
  })

  /**-----------------------  addAnswers  -----------------------------*/
  describe('addAnswer() in question repository', () => {

    //questionId validation
    const addAnswerQuestionIdValidation = JSON.parse(JSON.stringify(badCaseSolutions))

    const addAnswerQuestionIdChecker = addAnswerQuestionIdValidation.map(async el => {
      el[0] = el[0].replace('addQuestion', 'addAnswer')
      el[0] = el[0].replace('author', 'questionId')
      el[2] = 'Here\'s my answer'
      el[3] = 'Me as Author'

      return el
    })

    addAnswerQuestionIdChecker.forEach(el => {
      test(el[0], async () => {

        await expect(async () => await questionRepo.addAnswer(el[1], el[2], el[3])).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
      })
    })

    //answerString validation
    const addAnswerAnswersStringValidation = JSON.parse(JSON.stringify(badCaseSolutions))

    const addAnswerAnswersStringChecker = addAnswerAnswersStringValidation.map(async el => {
      el[0] = el[0].replace('addQuestion', 'addAnswer')
      el[0] = el[0].replace('author', 'answerString')
      el[2] = uuid
      el[3] = 'Me as Author'

      return el
    })

    addAnswerAnswersStringChecker.forEach(el => {
      test(el[0], async () => {
        await expect(async () => await questionRepo.addAnswer(el[2], el[1], el[3])).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
      })
    })

    //authorString validation
    const addAnswerAuthorStringValidation = JSON.parse(JSON.stringify(badCaseSolutions))

    const addAnswerAuthorStringChecker = addAnswerAuthorStringValidation.map(async el => {
      el[0] = el[0].replace('addQuestion', 'addAnswer')
      el[0] = el[0].replace('author', 'AuthorString')
      el[2] = uuid
      el[3] = 'Here\'s my answer'

      return el
    })

    addAnswerAuthorStringChecker.forEach(el => {
      test(el[0], async () => {
        await expect(async () => await questionRepo.addAnswer(el[2], el[3], el[1])).rejects.toThrow(new ValidationError('Sorry, this is not UUID.'))
      })
    })

    test('Add new answer to file', async () => {

      await expect(async () => await questionRepo.addAnswer(el[2], el[1], el[3])).rejects.toThrow()
    })

    test('getAnswers() should Add new answer to correct question and add it to the file', async () => {
      const answerString = 'Good Answer'
      const authorString = 'One and only'
      const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
      const { id } = await questionRepo.addAnswer(uuid, answerString, authorString)
      const answers = await questionRepo.getAnswers(uuid)

      expect(answers).toHaveLength(2)
      expect(id).toHaveLength(36)
      expect(id).toMatch(regex)
      expect(answers[1]).toEqual(expect.objectContaining({
        author: authorString,
        summary: answerString
      }))
      expect(answers[1]).toHaveProperty('id', expect.stringMatching(regex))
      expect(answers[0]).toEqual(expect.objectContaining(testQuestionAnswer))
    })
  })


})
