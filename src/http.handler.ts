import { isResponseType } from "./utils";
import {
  httpResponseHandler,
  httpResponsePayloadHandler,
} from "./http.response.handler";
import { httpErrorHandler } from "./http.error.handler";
import { HttpStatusCode } from "./enum";
import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { HttpErrorException } from "./exceptions";
import { createLoggingHandler, ErrorHandlingType } from "./logging.handler";

export type APIGatewayJsonEvent<
  T extends { [s: string]: any }
> = APIGatewayEvent & {
  json: T;
};

export type HttpHandlerFunction<T, R> = (
  event?: APIGatewayEvent | APIGatewayJsonEvent<T>,
  context?: Context,
) => Promise<void | Partial<APIGatewayProxyResult> | APIGatewayProxyResult | R>;

/**
 * A universal wrapper function response hander for aws handlers
 *
 * @param fn your custom handler function
 * @param defaultStatus Http Status Code
 * @param errorHandlingOptions
 */
export const httpHandler = <T extends { [s: string]: any }, R extends any>(
  fn: HttpHandlerFunction<T, R>,
  defaultStatus: HttpStatusCode = HttpStatusCode.OK,
  errorHandlingOptions: ErrorHandlingType = [HttpStatusCode.BAD_REQUEST, HttpStatusCode.NETWORK_READ_TIMEOUT],
): ((
  event: APIGatewayEvent,
  context: Context,
) => Promise<APIGatewayProxyResult>) => (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const loggingHandler = createLoggingHandler();
  return new Promise(async (resolve) => {
    let jsonEvent: APIGatewayJsonEvent<T>;

    if (
      typeof event.body === "string" &&
      event?.headers["Content-Type"]?.toLowerCase() === "application/json"
    ) {
      try {
        jsonEvent = { ...event, json: JSON.parse(event.body) };
      } catch (e) {
        resolve(
          httpErrorHandler(
            new HttpErrorException(
              "Malformed JSON",
              HttpStatusCode.BAD_REQUEST,
            ),
          ),
        );
      }
    }

    try {
      const result = await fn(jsonEvent || event, context);

      if (isResponseType(result)) {
        if (!result.hasOwnProperty("statusCode"))
          result.statusCode = defaultStatus;

        if (result.body) result.body = httpResponsePayloadHandler(result.body);

        resolve(result);
      }

      resolve(httpResponseHandler(result, defaultStatus));
    } catch (error) {
      loggingHandler(errorHandlingOptions, error);
      resolve(httpErrorHandler(error));
    }
  });
};
