import { NextFunction, Request, Response } from 'express';
import { fillSurvey, listSurveyResponsesByAudience } from '@/services/surveyResponseServices';
import logger from '../utils/logger';

export const fillSurveyController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const answers = req.body;

  try {
    const surveyResponse = await fillSurvey({surveyId: Number(id), ...answers});
    logger.info(`Survey response recorded for survey ID: ${id}`);
    res.status(201).json(surveyResponse);
  } catch (err) {
    logger.error(`Error filling survey: ${err}`);
    next(err)
  }
};

export const listSurveyResponsesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetAudience } = req.query;
  const sortByStars = req.query.sortByStars === 'desc' ? 'desc' : 'asc';

  try {
    const responses = await listSurveyResponsesByAudience(targetAudience as string, sortByStars);
    res.status(200).json(responses);
  } catch (err) {
    logger.error(`Error listing survey responses: ${err}`);
    next(err)
  }
};