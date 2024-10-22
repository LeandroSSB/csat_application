import { Router, Express } from 'express';
import { createSurvey, listSurveysController, updateSurveyController, findSurveyController } from '@/controllers/surveyController';


const surveyRoutes = (app : Express) =>  {
  const router = Router();
  router.post('/', createSurvey);
  router.get('/', listSurveysController);
  router.put('/:id', updateSurveyController);
  router.get('/:id', findSurveyController);


  app.use("/survey", router)
}




export default surveyRoutes;