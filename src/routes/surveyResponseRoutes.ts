import { Router, Express } from 'express';
import { fillSurveyController, listSurveyResponsesController } from '@/controllers/surveyResponseController';
import { ValidateMiddleware } from '@/middlewares';
import { surveyResponseSchema } from "@/schemas"

const surveyRoutes = (app : Express) =>  {
  const router = Router();
  router.post('/:id', ValidateMiddleware(surveyResponseSchema), fillSurveyController );
  router.get('/list', listSurveyResponsesController);
  
  app.use("/response", router)
}


export default surveyRoutes;