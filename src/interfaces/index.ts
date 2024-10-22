export interface ISurveyProps {
  targetAudience: string
  ratingStars: number
  contactEmail: string
}

export interface ISurveyResponseProps {
  response: string
  stars: number
}

export interface UpdateSurveyData {
  targetAudience?: string;
  contactEmail?: string;
  ratingStars?: number;
}