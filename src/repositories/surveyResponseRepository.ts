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