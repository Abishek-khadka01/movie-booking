import { Request, Response, NextFunction } from "express";

export const ErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
