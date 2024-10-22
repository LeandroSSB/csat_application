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