import { Router, Express } from 'express';
import { createSurvey } from '../controllers/surveyController';


const surveyRoutes = (app : Express) =>  {
  const router = Router();
  router.post('/', createSurvey);


  app.use(router)
}




export default surveyRoutes;