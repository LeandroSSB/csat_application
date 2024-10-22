import prisma from '@/services/prismaClient';
import { Survey } from '@prisma/client';
import logger from '@/utils/logger';


export const createSurvey = async (targetAudience: string, contactEmail: string, ratingStars: number): Promise<Survey> => {
  logger.info(`Saving survey to the database: ${ 
    {
      targetAudience,
      contactEmail,
      ratingStars
    } 
  }`);
  return await prisma.survey.create({
    data: {
      targetAudience,
      contactEmail,
      ratingStars
    }
  });
};


export const updateSurvey = async (id: number, data: Partial<Survey>): Promise<Survey | null> => {
  logger.info(`Updating survey in the database: id=${id}`);
  return await prisma.survey.update({
    where: { id },
    data,
  });
};


export const findSurveyById = async (id: number): Promise<Survey | null> => {
  logger.info(`Find survey in the database: id=${id}`);
  return await prisma.survey.findUnique({
    where: { id },
  });
};


export const listSurveys = async (): Promise<Survey[] | null> => {
  logger.info("list survey in the database");
  return await prisma.survey.findMany()
}