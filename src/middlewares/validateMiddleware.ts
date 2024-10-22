import { ErrorHandler } from "@/utils/error";
import logger from "@/utils/logger";
import { Request, Response, NextFunction } from "express";
import { AnySchema, ValidationError } from "yup"


const validate =
  (schema: AnySchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const resource = req.body;
    try {
      await schema.validate(resource, { abortEarly: false });
      logger.info(`Schema validation passed: ${req.method} ${req.path}`)
      next();
    } catch (err ) {
      if (err instanceof ValidationError ) {
        logger.warn(`Schema validation failed: ${req.method} ${req.path} `)
        next(new ErrorHandler(400, err.errors.join(", ")))
      } else {
        logger.error(`Unexpected error: ${req.method} ${req.path} `)
        next(err)
      }
    }
  };


export default validate