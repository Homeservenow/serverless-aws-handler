import { isResponseType as isApiGatewayResponse } from "./utils";
import { httpResponseBuilder } from "./http.response.builder";
import {
  APIGatewayEvent,
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { createOptions } from "./http.handler.options";
import { HttpHandlerFunctionOrOptions } from "./interfaces";

export type PromisifiedAPIGatewayProxyHandler = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>

/**
 * A universal wrapper function response hander for aws handlers
 */
export const httpHandler = <RequestType extends any, ResponseType extends any>(
  handlerOptionsOrFunction: HttpHandlerFunctionOrOptions<
    RequestType,
    ResponseType
  >,
): PromisifiedAPIGatewayProxyHandler => (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const options = createOptions(handlerOptionsOrFunction);

  return new Promise(async (resolve) => {
    try {
      const deserialisedPayload = options.serialise.input(event);

      const body = options.validator(deserialisedPayload);

      const result = await options.handler({ body, event, context });

      if (isApiGatewayResponse(result)) {
        if (!result.hasOwnProperty("statusCode")) {
          result.statusCode = options.defaultStatusCode;
        }

        if (result.body) {
          result.body = options.serialise.output(result.body);
        }

        resolve(result);
      }

      resolve(
        httpResponseBuilder(
          result,
          options.defaultStatusCode,
          options.serialise.output,
          options.defaultOutputHeaders,
        ),
      );
    } catch (error) {
      options.logger(
        options.loggingOptions,
        error,
      );
      resolve(
        options.errorHandler(error)
      );
    }
  });
};
