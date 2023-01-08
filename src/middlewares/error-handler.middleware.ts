import { GoogleMapsIntegrationError, UnprocessableEntityError } from "errors/errors";
import { NextFunction, Request, Response } from "express";

export function handleErrorMiddleware(error: Error, _: Request, res: Response, next: NextFunction): void {
  const { message } = error;

  if (error instanceof UnprocessableEntityError) {
    res.status(422).send({ name: "UnprocessableEntityError", message });
  } else if (error instanceof GoogleMapsIntegrationError) {
    res.status(500).send({ name: "GoogleMapsIntegrationError", message });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }

  next();
}
