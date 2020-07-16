import { isResponseType } from "./utils";
import {
  httpResponseHandler,
  httpResponsePayloadHandler,
} from "./http.response.handler";
import { httpErrorHandler, ErrorHandlerFunction } from "./http.error.handler";
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
  ErrorHandlingType,
  LoggerFunction,
} from "./logging.handler";
import { ValidatorFunction } from "./validator";
import { JSONParse, APIGatewayJsonEvent } from "./utils/json.parse";

export type HttpHandlerFunction<T, R> = (
  event?: APIGatewayEvent | APIGatewayJsonEvent<T>,
  context?: Context,
) => Promise<void | Partial<APIGatewayProxyResult> | APIGatewayProxyResult | R>;

export type HttpHandlerOptions<R> = {
  errorHandler?: ErrorHandlerFunction;
  defaultStatusCode?: HttpStatusCode;
  defaultHeaders?: { [s: string]: string };
  logger?: LoggerFunction;
  validator?: ValidatorFunction;
  serialise?: {
    input?: (value: APIGatewayEvent) => APIGatewayEvent;
    output?: (value: R) => R | any;
  };
  loggingHandlingOpions?: ErrorHandlingType;
};

export type HttpHandlerFunctionOptions<T, R> =
  | ({
      handler: HttpHandlerFunction<T, R>;
    } & HttpHandlerOptions<R>)
  | HttpHandlerFunction<T, R>;

/**
 * A universal wrapper function response hander for aws handlers
 *
 * @param fn your custom handler function
 * @param defaultStatus Http Status Code
 * @param errorHandlingOptions
 */
export const httpHandler = <T extends { [s: string]: any }, R extends any>(
  handlerOptions: HttpHandlerFunctionOptions<T, R>,
): APIGatewayProxyHandler => (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>,
): Promise<APIGatewayProxyResult> => {
  const options: HttpHandlerFunctionOptions<T, R> =
    typeof handlerOptions === "function"
      ? {
          handler: handlerOptions,
        }
      : handlerOptions;

  const loggingHandler = options.logger || createLoggingHandler();

  return new Promise(async (resolve) => {
    // TODO add output serialisers
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
      resolve(httpErrorHandler(error));
    }
  });
};
