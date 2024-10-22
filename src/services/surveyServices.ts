import { createSurvey as createSurveyRepo, findSurveyById, updateSurvey as updateSurveyRepo, listSurveys as listSurveysRepo } from '@/repositories/surveyRepository';
import { ErrorHandler } from '@/utils/error';
import logger from '@/utils/logger';
import { ISurveyProps, UpdateSurveyData } from "@/interfaces"
import { findSurveyResponsesByTargetAudience } from '../repositories/surveyResponseRepository';
import { Parser } from 'json2csv';

export const createSurvey = async ( { targetAudience, questions = [] } : ISurveyProps ) => {
  logger.info(`Creating survey for: targetAudience=${targetAudience}`);

  const adicionalMandatoryQuestions = [
    "Público-alvo",
    "Quantidade de estrelas",
    "E-mail para contato"
  ]

  const allQuestions = adicionalMandatoryQuestions.concat(questions.filter((question) => !adicionalMandatoryQuestions.includes(question)));

  try {
    return await createSurveyRepo(targetAudience, allQuestions );
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

  const mandatoryQuestions = [
    "Público-alvo",
    "Quantidade de estrelas",
    "E-mail para contato"
  ];

  const { targetAudience, questions  } = updateData

  const allQuestions = questions ? mandatoryQuestions.concat(questions) : []

  try{
    const updatedSurvey = await updateSurveyRepo(id, { targetAudience  }, allQuestions);
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
  
  const csvData = responses.map(response => {
    const answers = response.answers.reduce((acc: any, answer: any) => {
      acc[answer.question.content] = answer.answer;
      return acc;
    }, {});
    
    return answers
  });

  // const csvFields = ['surveyId', 'response', 'stars',  'createdAt', 'targetAudience', 'contactEmail', 'ratingStars'];
  const json2csvParser = new Parser();

  return json2csvParser.parse(csvData);
};