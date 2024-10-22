import { findSurveyById } from '@/repositories/surveyRepository';
import { findSurveyResponsesByTargetAudience } from '@/repositories/surveyResponseRepository';
import { saveSurveyResponse } from '@/repositories/surveyResponseRepository';
import { ISurveyResponseProps } from "@/interfaces"
import logger from '@/utils/logger';

export const fillSurvey = async ( answers: ISurveyResponseProps) => {
  const { response, stars, surveyId } = answers

  logger.info(`Filling survey with ID: ${surveyId}`);

  const survey = await findSurveyById(surveyId);
  if (!survey) {
    logger.warn(`Survey not found: id=${surveyId}`);
    throw new Error('Survey not found');
  }


  // Verifique se todas as perguntas obrigatórias estão presentes
  if (!response || !stars || !surveyId) {
    logger.warn('Missing required fields in survey response');
    throw new Error('Missing required fields');
  }

  try {
    const surveyResponse = await saveSurveyResponse( surveyId,  response, stars );
    logger.info(`Survey response saved: ${JSON.stringify(surveyResponse)}`);
    return surveyResponse;
  } catch (err) {
    logger.error(`Error in fillSurvey service: ${err}`);
    throw err;
  }
};

export const listSurveyResponsesByAudience = async (targetAudience: string, sortByStars: 'asc' | 'desc') => {
  return await findSurveyResponsesByTargetAudience(targetAudience, sortByStars);
};