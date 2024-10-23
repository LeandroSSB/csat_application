import { NextFunction, Request, Response } from 'express';
import { fillSurvey, listSurveyResponsesByAudience } from '@/services/surveyResponseServices';
import logger from '../utils/logger';
import { generateCsvFromSurveyResponses } from '@/utils/csvResponse';

export const fillSurveyController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const {  ratingStars, contactEmail, answers } = req.body;;

  try {
    const surveyResponse = await fillSurvey(
      {
      surveyId: Number(id),
      answers, 
      ratingStars,
      contactEmail
    }
    );
    logger.info(`Survey response recorded for survey ID: ${id}`);
    res.status(201).json(surveyResponse);
  } catch (err) {
    logger.error(`Error filling survey: ${err}`);
    next(err)
  }
};

export const listSurveyResponsesController = async (req: Request, res: Response, next: NextFunction) => {
  const { targetAudience } = req.query;
  const sortByStars = req.query.sortByStars === 'desc' ? 'desc' : 'asc';
  const format = req.query.format || 'json';

  try {
    const responses = await listSurveyResponsesByAudience(targetAudience as string, sortByStars);
    
    if (format === 'csv') {
      const csv = generateCsvFromSurveyResponses(responses as Array<object>);
      res.header('Content-Type', 'text/csv');
      res.attachment(`survey-responses-${targetAudience}-${new Date().toJSON()}.csv`);
      return res.send(csv);
    } else {
      return res.json(responses);
    }
  } catch (err) {
    logger.error(`Error listing survey responses: ${err}`);
    next(err)
  }
};