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
import { createLoggingHandler } from "./logging.handler";
import { JSONParse } from "./utils/json.parse";
import {
  HttpHandlerFunctionOptions,
  HttpHandlerDefaultOptions,
  HttpHandlerFunctionBuiltOptions,
} from "./interfaces";

const createOptions = <RequestType, ResponseType>(
  options: HttpHandlerFunctionOptions<RequestType, ResponseType>,
): HttpHandlerFunctionBuiltOptions<RequestType, ResponseType> => {
  const defaultOptions: HttpHandlerDefaultOptions<RequestType, ResponseType> = {
    errorHandler: httpErrorHandler,
    logger: createLoggingHandler(),
    defaultStatusCode: HttpStatusCode.OK,
    loggingHandlingOptions: [
      HttpStatusCode.BAD_REQUEST,
      HttpStatusCode.NETWORK_READ_TIMEOUT,
    ],
    serialise: {
      input: JSONParse,
      output: httpResponsePayloadHandler,
    },
  };

  return typeof options === "function"
    ? {
        ...defaultOptions,
        handler: options,
      }
    : {
        ...defaultOptions,
        ...options,
      };
};

/**
 * A universal wrapper function response hander for aws handlers
 */
export const httpHandler = <RequestType extends any, ResponseType extends any>(
  handlerOptionsOrFunction: HttpHandlerFunctionOptions<
    RequestType,
    ResponseType
  >,
): APIGatewayProxyHandler => (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>,
): Promise<APIGatewayProxyResult> => {
  const options = createOptions(handlerOptionsOrFunction);

  return new Promise(async (resolve) => {
    try {
      const deserialisedPayload = options.serialise.input
        ? options.serialise.input(event)
        : JSONParse(event);

      const payload = options.validator
        ? options.validator(deserialisedPayload)
        : deserialisedPayload;

      const result = await options.handler({ payload, event, context });

      if (isResponseType(result)) {
        if (!result.hasOwnProperty("statusCode")) {
          result.statusCode = options.defaultStatusCode;
        }

        if (result.body)
          result.body = options.serialise.output
            ? options.serialise.output(result.body)
            : httpResponsePayloadHandler(result.body);

        resolve(result);
      }

      resolve(
        httpResponseHandler(
          result,
          options.defaultStatusCode,
          options?.serialise?.output || httpResponsePayloadHandler,
          options.defaultOutputHeaders,
        ),
      );
    } catch (error) {
      options.logger(
        options.loggingHandlingOptions || [
          HttpStatusCode.BAD_REQUEST,
          HttpStatusCode.NETWORK_READ_TIMEOUT,
        ],
        error,
      );
      resolve(
        options.errorHandler
          ? options.errorHandler(error)
          : httpErrorHandler(error),
      );
    }
  });
};
