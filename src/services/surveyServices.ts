import { createSurvey as createSurveyRepo, findSurveyById, updateSurvey as updateSurveyRepo, listSurveys as listSurveysRepo } from '@/repositories/surveyRepository';
import { ErrorHandler } from '@/utils/error';

export const createSurvey = async (targetAudience: string, contactEmail: string, ratingStars: number) => {
  return await createSurveyRepo(targetAudience, contactEmail, ratingStars);
};


export const updateSurvey = async (id: number, targetAudience?: string, contactEmail?: string, ratingStars?: number) => {
  const existingSurvey = await findSurveyById(id);

  if (!existingSurvey) {
    throw new ErrorHandler(404, 'Survey not found');
  }

  return await updateSurveyRepo(id, { targetAudience, contactEmail, ratingStars });
};


export const findSurvey = async (id: number ) => {
  const survey = await findSurveyById(id);

  if (!survey) {
    throw new ErrorHandler(404, 'Survey not found');
  }

  return survey
}

export const listSurveys = async () => {
  return await listSurveysRepo()
}