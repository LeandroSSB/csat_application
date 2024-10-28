import prisma from '@/services/prismaClient';
import { SurveyResponse } from '@prisma/client';
import logger from '@/utils/logger';
import { SurveyResponseSurveyAnswer } from '@/interfaces';

export const saveSurveyResponse = async ( surveyId: number,  ratingStars: number, answers: { questionId: number; answer: string; }[]): Promise<SurveyResponseSurveyAnswer> => {
  logger.info('Saving survey response to the database');
  return await prisma.surveyResponse.create({
    data: {
      surveyId,
      ratingStars,
      answers: {
        create: answers.map(({ answer, questionId }) => ({
          questionId: questionId,
          answer: answer
        }))
      }
    },
    include: {
      survey: true,
      answers: true
    }
  });
};

export const findSurveyResponsesByTargetAudience = async (targetAudience: string, sortByStars: 'asc' | 'desc') => {
  const responses =  await prisma.surveyResponse.findMany({
    where: { 
      survey: {
        targetAudience: {
          contains: targetAudience,
          mode: 'insensitive'
        }
      }
    },
    include: {    
      answers: {
        select: {
          question: {
            select: {
              content: true
            }
          },
          answer: true,
        }
      }
    },
    orderBy: { ratingStars: sortByStars }
  });
  return responses
};
