import { HttpErrorResponseInterface } from "./interfaces";
import { HttpStatusCode } from "./enums";
import { APIGatewayProxyResult } from "aws-lambda";
import { isHttpErrorException } from "./utils";

export type ErrorHandlerFunction = (
  error: HttpErrorResponseInterface | Error,
) => APIGatewayProxyResult;

export const httpErrorHandler: ErrorHandlerFunction = (
  error: HttpErrorResponseInterface | Error,
): APIGatewayProxyResult => ({
  statusCode: isHttpErrorException(error)
    ? error.getStatus()
    : HttpStatusCode.INTERNAL_SERVER_ERROR,
  headers:
    isHttpErrorException(error) && Object.keys(error.headers).length >= 1
      ? error.headers
      : undefined,
  body:
    isHttpErrorException(error) && error.hasData()
      ? JSON.stringify({ message: error.getMessage(), data: error.getData() })
      : JSON.stringify({
          message: error.message,
        }),
});
