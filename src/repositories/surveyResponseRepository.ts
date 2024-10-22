import prisma from '@/services/prismaClient';
import { SurveyResponse } from '@prisma/client';
import logger from '@/utils/logger';

export const saveSurveyResponse = async (surveyId: number, response: string, stars: number): Promise<SurveyResponse> => {
  logger.info('Saving survey response to the database');
  return await prisma.surveyResponse.create({
    data: {
      surveyId,
      response,
      stars
    },
  });
};

export const findSurveyResponsesByTargetAudience = async (targetAudience: string, sortByStars: 'asc' | 'desc') => {
  return await prisma.surveyResponse.findMany({
    where: { 
      survey: {
        targetAudience: {
          mode: 'insensitive'
        }
      }
    },
    include: {
      survey: {
        select: {
          targetAudience: true,
          contactEmail: true,
          ratingStars: true
        }
      }
    },
    orderBy: { stars: sortByStars },
  });
};