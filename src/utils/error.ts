import { Response } from "express";

export class ErrorHandler extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super();
    this.message = message;
    this.statusCode = statusCode || 500;
  }
}

export const handleError = (err: any, res: Response) => {
  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
    status: "error",
    statusCode: statusCode || 500,
    message,
  });
};

module.exports = {
  handleError,
  ErrorHandler,
};