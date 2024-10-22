import prisma from '@/services/prismaClient';
import { Survey } from '@prisma/client';
import logger from '@/utils/logger';


export const createSurvey = async (targetAudience: string, allQuestions: string[]): Promise<Survey> => {
  logger.info(`Creating survey for target audience: ${targetAudience}`);

  const survey =  await prisma.survey.create({
    data: {
      targetAudience,
      questions: {
        create: allQuestions.map((question) => ({
          content: question,
        })),
      }
    },
    include: { questions: true },
  });
  logger.info(`Survey created with ID: ${survey.id}`);

  return survey
};


export const updateSurvey = async (id: number, data: Partial<Survey>, questions: string[] = [] ): Promise<Survey | null> => {
  logger.info(`Updating survey in the database: id=${id}`);
  if ( !questions.length ) {
    return await prisma.survey.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date().toJSON(), 
      },
      include: { questions: true },
    });
  }
  return await prisma.survey.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date().toJSON(), 
      questions: {
        deleteMany: {},
        create: questions.map((question) => ({
          content: question,
        })),
      }
    },
    include: { questions: true },
  });
};


export const findSurveyById = async (id: number): Promise<Survey | null> => {
  logger.info(`Find survey in the database: id=${id}`);
  return await prisma.survey.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          answers: {
            select: {
              answer: true 
            }
          }
        }
      }
    }
  });
};


export const listSurveys = async (): Promise<Survey[] | null> => {
  logger.info("list survey in the database");
  return await prisma.survey.findMany({
    include: { questions: true },
  })
}