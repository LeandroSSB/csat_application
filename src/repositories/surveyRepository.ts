import prisma from '@/services/prismaClient';
import { Survey } from '@prisma/client';

export const createSurvey = async (targetAudience: string, contactEmail: string, ratingStars: number): Promise<Survey> => {
  return await prisma.survey.create({
    data: {
      targetAudience,
      contactEmail,
      ratingStars
    }
  });
};


export const updateSurvey = async (id: number, data: Partial<Survey>): Promise<Survey | null> => {
  return await prisma.survey.update({
    where: { id },
    data,
  });
};


export const findSurveyById = async (id: number): Promise<Survey | null> => {
  return await prisma.survey.findUnique({
    where: { id },
  });
};


export const listSurveys = async (): Promise<Survey[] | null> => {
  return await prisma.survey.findMany()
}