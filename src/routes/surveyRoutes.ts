import { Router, Express } from 'express';
import { createSurvey, listSurveysController, updateSurveyController, findSurveyController } from '@/controllers/surveyController';
import { ValidateMiddleware } from '@/middlewares';
import { surveySchema } from "@/schemas"

const surveyRoutes = (app : Express) =>  {
  const router = Router();
  router.post('/', ValidateMiddleware(surveySchema),  createSurvey);
  router.get('/', listSurveysController);
  router.put('/:id', updateSurveyController);
  router.get('/:id', findSurveyController);


  app.use("/survey", router)
}


export default surveyRoutes;