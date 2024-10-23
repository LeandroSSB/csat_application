import { Prisma } from "@prisma/client"

export interface ISurveyProps {
  targetAudience: string,
  questions: string[]
}

export interface ISurveyAnswer {
  questionId: number
  answer: string
}

export interface ISurveyResponseProps {
  ratingStars: number
  contactEmail: string
  answers: ISurveyAnswer[]
  surveyId: number
}


export interface UpdateSurveyData {
  targetAudience?: string,
  questions?: string[]
}

export type SurveyWithQuestionsAnswers = Prisma.SurveyGetPayload<{
  include: { questions: { include: { answers: true } } }
}>

export type SurveyWithQuestions = Prisma.SurveyGetPayload<{
  include: { questions: true } 
}>


export type SurveyResponseAnswersQuestions = Prisma.SurveyResponseGetPayload<{
  include: {
    answers: {
      select: {
        question: {
          select: {
            content: true
          }
        },
        answer: true
      }
    }
  }
}>

export type SurveyResponseAnswers= Prisma.SurveyResponseGetPayload<{
  include: {
    answers: true
  }
}>

