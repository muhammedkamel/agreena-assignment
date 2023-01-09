import { GoogleMapsIntegrationError, ResourceNotFoundError, UnAuthorizedError, UnprocessableEntityError } from "errors/errors";
import { NextFunction, Request, Response } from "express";

export function handleErrorMiddleware(error: Error, _: Request, res: Response, next: NextFunction): void {
  const { message } = error;

  if (error instanceof UnprocessableEntityError) {
    res.status(422).send({ name: "UnprocessableEntityError", message });
  } else if (error instanceof UnAuthorizedError) {
    res.status(401).send({ name: "UnAuthorizedError", message });
  } else if (error instanceof ResourceNotFoundError) {
    res.status(404).send({ name: "ResourceNotFoundError", message });
  } else if (error instanceof GoogleMapsIntegrationError) {
    res.status(500).send({ name: "GoogleMapsIntegrationError", message });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }

  next();
}
