import type {
  ErrorRequestHandler,
  Express,
  NextFunction,
  Request,
  Response,
} from "express";
import { handleError } from "@/utils/error";

import surveyRoutes from "./surveyRoutes"
import surveyResponseRoutes from "./surveyResponseRoutes"

const router = (app: Express) => {

  surveyRoutes(app)
  surveyResponseRoutes(app)

  app.use(
    (
      err: ErrorRequestHandler,
      _req: Request,
      res: Response,
      _next: NextFunction
    ) => {
      handleError(err, res)
    }
  )
}


export default router