import { Router, Express } from 'express';
import { createSurvey, listSurveysController, updateSurveyController, findSurveyController } from '@/controllers/surveyController';
import { ValidateMiddleware } from '@/middlewares';
import { surveySchema, surveySchemaOpcional } from "@/schemas"

const surveyRoutes = (app : Express) =>  {
  const router = Router();
  router.post('/', ValidateMiddleware(surveySchema),  createSurvey);
  router.get('/', listSurveysController);
  router.put('/:id', ValidateMiddleware(surveySchemaOpcional), updateSurveyController);
  router.get('/:id', findSurveyController);


  app.use("/survey", router)
}


export default surveyRoutes;