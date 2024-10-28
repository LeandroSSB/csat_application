import { findSurveyById } from '@/repositories/surveyRepository';
import { findSurveyResponsesByTargetAudience } from '@/repositories/surveyResponseRepository';
import { saveSurveyResponse } from '@/repositories/surveyResponseRepository';
import { ISurveyResponseProps } from "@/interfaces"
import logger from '@/utils/logger';
import { ErrorHandler } from '@/utils/error';
import { transporter as EmailSender } from "@/utils"
import  {  } from "nodemailer"

export const fillSurvey = async ( { answers, ratingStars, surveyId } :ISurveyResponseProps ) => {

  logger.info(`Filling survey with ID: ${surveyId}`);

  const survey = await findSurveyById(surveyId);
  if (!survey) {
    logger.warn(`Survey not found: id=${surveyId}`);
    throw new ErrorHandler(404, 'Survey not found');
  }

  const answeredEveryQuestion = survey.questions.every(question => answers.find( answer => answer.questionId == question.id ))
  const hasInvalidQuestions = !answers.every(answer => survey.questions.find(question => question.id == answer.questionId))
  
  if (hasInvalidQuestions){
    const invalidQuestions = answers.filter(answer => !survey.questions.find(question => question.id == answer.questionId)).map(({ questionId, answer }) => `${questionId} with answer: ${answer}` )

    logger.warn(`Survey with invalid question's id: survey id=${surveyId}`);
    throw new ErrorHandler(400, `Survey with invalid question's id: ${invalidQuestions.join(", ")} `);
  }

  if ( ! answeredEveryQuestion ) {
    const questionsLeft = survey.questions.filter(question => !answers.find(answer => answer.questionId == question.id) ).map(question => question.content)

    logger.warn(`Survey not completely responded: id=${surveyId}`);
    throw new ErrorHandler(400, `Survey not completely responded. Questions left: ${questionsLeft.join(",")}`);
  }
  const emailQuestion = survey.questions.find((question) => question.content === "E-mail para contato" )

  if ( !emailQuestion ) {
    logger.warn(`Survey without email question: ${survey.id}`);
    throw new ErrorHandler(422, `Survey without email question: ${survey.id}`)
  }

  const emailAnswer = answers.find((answer) => answer.questionId === emailQuestion.id )

  if ( !emailAnswer ) {
    logger.warn(`Email question without response: ${survey.id}`);
    throw new ErrorHandler(400, `Email question without response: ${survey.id}`)
  }

  try {
    const surveyResponse = await saveSurveyResponse( surveyId, ratingStars, answers );
    logger.info(`Survey response saved: ${JSON.stringify(surveyResponse)}`);


    const targetAudience = surveyResponse.survey.targetAudience


    const info = await EmailSender.sendMail({
      from: 'noreply@surveys.email', // sender address
      to: emailAnswer.answer, // list of receivers
      subject: `${targetAudience} Team`, // Subject line
      text: "Thank you for answering the survey", // plain text body
      // html: "<b>Hello world?</b>", // html body
    })
    logger.warn(`Survey email sent ${survey.id} to ${emailAnswer.answer}; ${info}`);


    return surveyResponse;
  } catch (err) {
    logger.error(`Error in fillSurvey service: ${err}`);
    throw err;
  }
};

export const listSurveyResponsesByAudience = async (targetAudience: string, sortByStars: 'asc' | 'desc') => {
  const responses = await findSurveyResponsesByTargetAudience(targetAudience, sortByStars);
  
  if(!responses.length) {
    throw new ErrorHandler(404, "Target audience without responses")
  }

  return responses
};