# Welcome to the responder

# DISCLAIMER
I've decided to rewrite the app to Typescript. So from now on, main branch of this repository will be js version, until I'll finish rewriting app on other branches and merge them into main branch. 

## Tech Stack and structure
I have tried to keep given tech stack and structure of application and code (according to prettier file). 
I added supertest to test endpoints. To use mockup testing to have rebuilt index.ts and put express app to server.ts file.
I have also created config file in config folder. It doesn't do too much, but it's a little cleaner. 

## Requirements
```bash
Node: v16.4.2
```

## Installation
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# tests
$ npm run test
```

## Routes
Limits and required data are in next section.
```bash
  @GET
  '/' - get all questions in file - returns array of questions
  @POST
  '/' - add new questions to file - you have to send  { author, summary } in body. Returns added  question id.
```

```bash
  @GET
  '/:questionId' - get one question by its id - you have to send right question id in param - returns array with question object
```

```bash
  @GET
  '/:questionId/answers' - get all answers for question with given Id - you have to send right question id in param - returns array of answers
  @POST
  '/:questionId/answers' - add new answer to question with given Id - you have to send right question id in param and  { author, summary } in body. Returns added  answer id.
```

```bash
  @GET
  '/:questionId/answers/:answerId' - get all answers for question with given Id - you have to send right question id and answer id in param - returns array with answer
```

## Validation and limitations
I have created validation functions to check if uuid, questions, answers and authors strings are fit to use it on backend. Due to non-existent expectations in that manner it checks mostly for basic things like length, if it is a string, and so on. UUID is being checked with regex for right structure. here are the limitations for following data:
* id's - created by uuid, so have to have **uuid (v4)** structure, length etc.;
* questions - string must be between **3 and 150** characters long, with **"?"** at the end;
* answers - string must be between **3 and 150** characters long;
* author - string must be between **3 and 50** characters long;

You can also find questionId and authorId, they are also validated and have to have **uuid (v4)** structure. But most importantly have to lead to existing data in file.


## Testing
I have created more than 100 dynamically generated tests for methods in question repository and validators. This and (very simple one method using routes) allowed me to mock test all endpoints. Mostly for right statusCodes and right answers. I have left few small easy to read, never changing files without tests.


# TASK DESCRIPTION

## Overview and the goal

This is a REST API that uses `express.js` for simple questions and answers submissions. The data is stored in the file `questions.json`. Initially, just a first few API endpoints are implemented. The goal of this exercise is to create and test the rest of the endpoints.

## Structure

The solution is a basic skeleton of `express.js` app:

1. The starting point is `index.ts` - it contains the routes definitions. Most of them are empty and should be implemented as part of solving this exercise. Use the `GET /questions` route as a reference.
2. The `repositories/question.ts` holds the data store (which is a simple file, stored on disk) for questions and answers. It also has functions that require implementation.
3. Ther is also a test file for `question repository`. Put your repository tests there.
4. The `middleware/repositories.ts` hooks a repository into the `req` object of `express.js`. No need to extend anything here.

## Some assumptions

1. The structure of questions and answers objects can be deducted from `questions.json`.
2. The `id` are GUID's (there is already `uuid` package added to `package.json` to facilitate their creation - use `v4`).
3. For endpoints that have `id` parameter it will look something like this:

```
GET /questions/50f9e662-fa0e-4ec7-b53b-7845e8f821c3/answers/d498c0a3-5be2-4354-a3bc-78673aca0f31
```

## Final words

Please make sure you write unit tests - part of the exercise is to explore your ability to write them. Also, try to cover all endpoints, however, this is not crucial.

## How to send the solution back

Upload your soultion to either Github or Gitlab and send us the link.
