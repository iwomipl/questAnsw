export type Answer = {
  id: string,
  summary: string,
  author: string,
}

export type IdObject = {
  id: string;
}

export type QuestionResponse = {
  id: string,
  summary: string,
  author: string,
  answers: Answer[]
}

export interface Question {
  getQuestions: () => Promise<QuestionResponse[]>;
  getQuestionById: (questionId: string) => Promise<QuestionResponse[]>;
  addQuestion: (authorString: string, questionString: string) => Promise<IdObject>;
  getAnswers: (questionId: string) => Promise<Answer[]>;
  getAnswer: (questionId: string, answerId: string) => Promise<Answer[]>;
  addAnswer: (questionId: string, answerString: string, authorString: string) => Promise<IdObject>;
}


