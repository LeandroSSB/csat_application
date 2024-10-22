import { NextFunction, Request, Response } from 'express';
import { createSurvey as createSurveyService, updateSurvey as updateSurveyService, findSurvey as findSurveyService, listSurveys as listSurveysService, exportSurveyResponsesAsCSV } from '@/services/surveyServices';
import logger from '@/utils/logger';
import {  UpdateSurveyData } from '@/interfaces';


export const createSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetAudience, questions } = req.body;

  try {
    const survey = await createSurveyService({ targetAudience, questions });
    logger.info(`Survey created successfully: ${JSON.stringify(survey)}`);
    res.status(201).json(survey);

  } catch (err) {
    logger.error(`Error creating survey: ${err}`);
    next(err)
  }
};


export const updateSurveyController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { targetAudience, questions  }: UpdateSurveyData = req.body;

  try {
    const updatedSurvey = await updateSurveyService(Number(id), { targetAudience, questions });
    logger.info(`Survey updated successfully: ${JSON.stringify(updatedSurvey)}`);
    res.status(200).json(updatedSurvey);
  } catch (err) {
    logger.error(`Error updating survey: ${err}`);
    next(err)
  }
};


export const listSurveysController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const surveys = await listSurveysService()
    res.status(200).json(surveys)
  }catch(err) {
    logger.error(`Error list survey: ${err}`);
    next(err)
  }
}


export const findSurveyController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const survey = await findSurveyService(Number(id));
    logger.info(`Survey find successfully`);
    res.status(200).json(survey);

  } catch (err) {
    logger.error(`Error find survey: ${err}`);
    next(err)
  }
}

export const exportSurveyResponsesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetAudience } = req.query;

  try {
    const csvData = await exportSurveyResponsesAsCSV(targetAudience as string);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${targetAudience}-${new Date().toJSON()}.csv`);
    res.send(csvData);
  } catch (err) {
    logger.error(`Error exporting survey responses: ${err}`);
    next(err)
  }
};