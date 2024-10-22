import { handleError } from '@/utils/error';
import { Request, Response } from 'express';


export const createSurvey = (req: Request, res: Response): void => {
  const { targetAudience, ratingStars, contactEmail } = req.body;

  if (!targetAudience || !ratingStars || !contactEmail) {
    res.status(400).send('Missing required fields');
    return;
  }

  try {
    // Try to perfrom creation


  }catch(e) {
    handleError(e, res)
  }

  res.status(201).send('Survey created successfully');
};