import { Request, Response } from 'express';
import { createSurvey as createSurveyService, updateSurvey as updateSurveyService, findSurvey as findSurveyService, listSurveys as listSurveysService } from '@/services/surveyServices';
import {  handleError } from '@/utils/error';


export const createSurvey = async (req: Request, res: Response): Promise<void> => {
  const { targetAudience, ratingStars, contactEmail } = req.body;

  if (!targetAudience || !ratingStars || !contactEmail) {
    res.status(400).send('Missing required fields');
    return;
  }

  try {
    const survey = await createSurveyService(targetAudience, contactEmail, ratingStars);
    res.status(201).json(survey);

  } catch (err) {
    handleError(err, res)
  }
};


export const updateSurveyController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { targetAudience, contactEmail, ratingStars } = req.body;

  try {
    const updatedSurvey = await updateSurveyService(Number(id), targetAudience, contactEmail, ratingStars);
    res.status(200).json(updatedSurvey);
  } catch (err) {
    handleError(err, res)
  }
};


export const listSurveysController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const surveys = await listSurveysService()
    res.status(200).json(surveys)
  }catch(err) {
    handleError(err, res)
  }
}


export const findSurveyController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const survey = await findSurveyService(Number(id));

    res.status(200).json(survey);

  } catch (err) {
    handleError(err, res)
  }
}