const { ValidationError } = require('../utils/errors')
const { uuidValidator, questionValidator } = require('./validators')
const { faker } = require('@faker-js/faker')

const uuid = faker.datatype.uuid()


describe('checking validation utils', () => {


  /**-----------------------  uuidValidator  -----------------------------*/
  test('uuidValidator() should throw an Error if have no arguments', () => {
    expect(() => uuidValidator()).toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('uuidValidator() should throw an Error if uuid is not uuid', () => {
    const questionID = 'random-gibberish'
    expect(() => uuidValidator(questionID)).toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('uuidValidator() should throw an Error if uuid is undefined', () => {
    expect(() => uuidValidator(undefined)).toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('uuidValidator() should throw an Error if uuid is null', () => {
    expect(() => uuidValidator(null)).toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('uuidValidator() should throw an Error if uuid is Boolean', () => {
    expect(() => uuidValidator(Boolean(Math.round(Math.random() * 0.5)))).toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('uuidValidator() should throw an Error if uuid is Number', () => {
    expect(() => uuidValidator(Math.round(Math.random() * 105.5))).toThrow(new ValidationError('Sorry, this is not UUID.'))
  })

  test('uuidValidator() should return true if given proper uuid', () => {
    expect(() => uuidValidator(uuid)).toBeTruthy()
  })

  /**-----------------------  questionValidator  -----------------------------*/
  test('questionValidator() should throw an Error if have no arguments', () => {
    expect(() => questionValidator()()).toThrow(new ValidationError('All questions should have question mark at the end My Friend. Fix it and send Your question again.'))
  })

  test('questionValidator() should throw an Error if "question" argument does Not have question mark at the end', () => {
    expect(() => questionValidator('ttt')).toThrow('All questions should have question mark at the end My Friend. Fix it and send Your question again.')
  })

  test('questionValidator() should throw an Error if "question" argument does Not have question mark at the end bu in the middle', () => {
    expect(() => questionValidator('t?tt')).toThrow('All questions should have question mark at the end My Friend. Fix it and send Your question again.')
  })

  test('questionValidator() should throw an Error if "question" argument is to short', () => {
    expect(() => questionValidator('t?')).toThrow('Question be between 3 and 150 characters long. Fix it and send Your question again.')
  })

  test('questionValidator() should throw an Error if "question" argument is to long', () => {
    expect(() => questionValidator(`${Array(150).fill('a', 0, 150).join('')}?`))
      .toThrow('Question be between 3 and 150 characters long. Fix it and send Your question again.')
  })

  test('questionValidator() should throw an Error if uuid is Number', () => {
    expect(() => questionValidator(Math.round(Math.random() * 105.5))).toThrow(new ValidationError('All questions should have question mark at the end My Friend. Fix it and send Your question again.'))
  })

  test('questionValidator() should throw an Error if uuid is undefined', () => {
    expect(() => questionValidator(undefined)).toThrow(new ValidationError('All questions should have question mark at the end My Friend. Fix it and send Your question again.'))
  })

  test('questionValidator() should throw an Error if uuid is null', () => {
    expect(() => questionValidator(null)).toThrow(new ValidationError('All questions should have question mark at the end My Friend. Fix it and send Your question again.'))
  })

  test('questionValidator() should throw an Error if uuid is Boolean', () => {
    expect(() => questionValidator(Boolean(Math.round(Math.random() * 0.5)))).toThrow(new ValidationError('All questions should have question mark at the end My Friend. Fix it and send Your question again.'))
  })

  test('questionValidator() should throw an Error if uuid is Number', () => {
    expect(() => questionValidator(Math.round(Math.random() * 105.5))).toThrow(new ValidationError('All questions should have question mark at the end My Friend. Fix it and send Your question again.'))
  })

  test('questionValidator() should return question string if given proper one', () => {
    const properQuestion = 'Is it really working?'
    const functionReturn = questionValidator(properQuestion)

    expect(functionReturn).toEqual(properQuestion)
  })


  /**-----------------------  answerValidator  -----------------------------*/


  /**-----------------------  authorValidator  -----------------------------*/


  /**-----------------------  addAnswers  -----------------------------*/


})