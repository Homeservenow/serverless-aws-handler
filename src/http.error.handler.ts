import { HttpErrorResponseInterface } from "./interfaces";
import { HttpStatusCode } from "./enum";
import { APIGatewayProxyResult } from "aws-lambda";
import { isHttpErrorException } from "./utils";

export const httpErrorHandler = (
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
          message: isHttpErrorException(error)
            ? error.getMessage()
            : HttpStatusCode.INTERNAL_SERVER_ERROR,
        }),
});
