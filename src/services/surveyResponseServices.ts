import { findSurveyById } from '@/repositories/surveyRepository';
import { findSurveyResponsesByTargetAudience } from '@/repositories/surveyResponseRepository';
import { saveSurveyResponse } from '@/repositories/surveyResponseRepository';
import { ISurveyResponseProps } from "@/interfaces"
import logger from '@/utils/logger';
import { ErrorHandler } from '@/utils/error';

export const fillSurvey = async ( { answers, ratingStars, surveyId } :ISurveyResponseProps ) => {

  logger.info(`Filling survey with ID: ${surveyId}`);

  const survey = await findSurveyById(surveyId);
  if (!survey) {
    logger.warn(`Survey not found: id=${surveyId}`);
    throw new ErrorHandler(404, 'Survey not found');
  }

  const answeredEveryQuestion = survey.questions.every(question => answers.find( answer => answer.questionId == question.id ))
  if ( ! answeredEveryQuestion ) {
    const questionsLeft = survey.questions.filter(question => !answers.find(answer => answer.questionId == question.id) ).map(question => question.content)

    logger.warn(`Survey not completely responded: id=${surveyId}`);
    throw new ErrorHandler(404, `Survey not completely responded. Questions left: ${questionsLeft.join(", ")}`);
  }

  try {
    const surveyResponse = await saveSurveyResponse( surveyId, ratingStars, answers );
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