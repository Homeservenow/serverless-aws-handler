import { isResponseType } from "./utils";
import {
  httpResponseHandler,
  httpResponsePayloadHandler,
} from "./http.response.handler";
import { httpErrorHandler } from "./http.error.handler";
import { HttpStatusCode } from "./enum";
import {
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
  Callback,
} from "aws-lambda";
import {
  createLoggingHandler,
} from "./logging.handler";
import { JSONParse } from "./utils/json.parse";
import {HttpHandlerFunctionOptions} from './interfaces';

/**
 * A universal wrapper function response hander for aws handlers
 */
export const httpHandler = <RequestType extends any, ResponseType extends any>(
  handlerOptions: HttpHandlerFunctionOptions<RequestType, ResponseType>,
): APIGatewayProxyHandler => (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>,
): Promise<APIGatewayProxyResult> => {
  const options: HttpHandlerFunctionOptions<RequestType, ResponseType> =
    typeof handlerOptions === "function"
      ? {
          handler: handlerOptions,
        }
      : handlerOptions;

  const loggingHandler = options.logger || createLoggingHandler();

  // TODO serialise output handler
  // TODO apply default headers
  // TODO use validator

  return new Promise(async (resolve) => {
    try {
      const serialisedEvent =
        options?.serialise?.input(event) || JSONParse(event);
      const result = await options.handler(serialisedEvent || event, context);

      if (isResponseType(result)) {
        if (!result.hasOwnProperty("statusCode")) {
          result.statusCode = options.defaultStatusCode || HttpStatusCode.OK;
        }

        if (result.body) result.body = httpResponsePayloadHandler(result.body);

        resolve(result);
      }

      resolve(
        httpResponseHandler(
          result,
          options.defaultStatusCode || HttpStatusCode.OK,
        ),
      );
    } catch (error) {
      loggingHandler(
        options.loggingHandlingOpions || [
          HttpStatusCode.BAD_REQUEST,
          HttpStatusCode.NETWORK_READ_TIMEOUT,
        ],
        error,
      );
      resolve(options.errorHandler ? options.errorHandler(error) : httpErrorHandler(error));
    }
  });
};
