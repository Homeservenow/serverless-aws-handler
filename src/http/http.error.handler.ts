import {
  DefaultHeadersInterface,
  HttpErrorResponseInterface,
} from "./interfaces";
import { HttpStatusCode } from "./enums";
import { APIGatewayProxyResult } from "aws-lambda";
import { isHttpErrorException } from "./utils";

export type ErrorHandlerFunction = (
  error: HttpErrorResponseInterface | Error,
  defaultHeaders?: DefaultHeadersInterface,
) => APIGatewayProxyResult;

export const httpErrorHandler: ErrorHandlerFunction = (
  error: HttpErrorResponseInterface | Error,
  defaultHeaders: DefaultHeadersInterface = {},
): APIGatewayProxyResult => ({
  statusCode: isHttpErrorException(error)
    ? error.getStatus()
    : HttpStatusCode.INTERNAL_SERVER_ERROR,
  headers: {
    ...defaultHeaders,
    ...(isHttpErrorException(error) ? error.headers : {}),
  },
  body:
    isHttpErrorException(error) && error.hasData()
      ? JSON.stringify({ message: error.getMessage(), data: error.getData() })
      : JSON.stringify({
          message: error.message,
        }),
});
