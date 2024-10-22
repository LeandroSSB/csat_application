import { createSurvey as createSurveyRepo, findSurveyById, updateSurvey as updateSurveyRepo, listSurveys as listSurveysRepo } from '@/repositories/surveyRepository';
import { ErrorHandler } from '@/utils/error';
import logger from '@/utils/logger';
import { ISurveyProps, UpdateSurveyData } from "@/interfaces"
import { findSurveyResponsesByTargetAudience } from '../repositories/surveyResponseRepository';
import { Parser } from 'json2csv';

export const createSurvey = async ( { targetAudience, contactEmail, ratingStars } : ISurveyProps ) => {
  logger.info(`Creating survey for: targetAudience=${targetAudience}, email=${contactEmail}`);

  try {
    return await createSurveyRepo(targetAudience, contactEmail, ratingStars);
  } catch(err) {
    logger.error(`Error in createSurvey service: ${err}`);
    throw err;
  }
};


export const updateSurvey = async (id: number, updateData: UpdateSurveyData) => {
  logger.info(`Updating survey: id=${id}`);

  const existingSurvey = await findSurveyById(id);

  if (!existingSurvey) {
    logger.warn(`Survey not found in updateSurvey service: id=${id}`);
    throw new ErrorHandler(404, 'Survey not found');
  }
  
  const { targetAudience, contactEmail, ratingStars } = updateData

  try{
    const updatedSurvey = await updateSurveyRepo(id, { targetAudience, contactEmail, ratingStars });
    logger.info(`Survey updated: id=${id}`);
    return updatedSurvey
  } catch(err){
    logger.error(`Error in updateSurvey service: ${err}`);
    throw err
  }
};


export const findSurvey = async (id: number ) => {
  const survey = await findSurveyById(id);

  if (!survey) {
    logger.warn(`Survey not found in findSurvey service: id=${id}`);
    throw new ErrorHandler(404, 'Survey not found');
  }

  return survey
}

export const listSurveys = async () => {
  logger.warn("Listing Surverys");
  return await listSurveysRepo()
}

export const exportSurveyResponsesAsCSV = async (targetAudience: string): Promise<string> => {
  const responses = await findSurveyResponsesByTargetAudience(targetAudience, 'asc');
  
  const flatResponses = responses.map(( item ) =>  {
    const { survey, ...rest } = item 
    return { ...survey, ...rest }
  } )

  const csvFields = ['surveyId', 'response', 'stars',  'createdAt', 'targetAudience', 'contactEmail', 'ratingStars'];
  const json2csvParser = new Parser({ fields: csvFields });
  return json2csvParser.parse(flatResponses);
};