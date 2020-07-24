import merge from "lodash.merge";
import { createLoggingHandler } from "./logging.handler";
import { httpErrorHandler } from "./http.error.handler";
import { httpResponsePayloadSerialiser } from "./http.response.builder";
import { HttpStatusCode } from "./enums";
import { JSONParse, defaultValidator } from "./utils";
import {
  HttpHandlerFunctionOrOptions,
  HttpHandlerDefaultOptions,
  HttpHandlerFunctionBuiltOptions,
  HttpHandlerDecoratorOptions,
  HttpHandlerDecoratorBuiltOptions,
} from "./interfaces";

export const getDefaultOptions = <
  RequestType,
  ResponseType
>(): HttpHandlerDefaultOptions<RequestType, ResponseType> => ({
  errorHandler: httpErrorHandler,
  logger: createLoggingHandler(),
  defaultStatusCode: HttpStatusCode.OK,
  loggingOptions: [
    HttpStatusCode.BAD_REQUEST,
    HttpStatusCode.NETWORK_READ_TIMEOUT,
  ],
  serialise: {
    input: JSONParse,
    output: httpResponsePayloadSerialiser,
  },
  validator: defaultValidator,
});

export const createDecoratorOptions = <ResponseType>(
  handlerOptions?: HttpHandlerDecoratorOptions<ResponseType>,
): HttpHandlerDecoratorBuiltOptions<ResponseType> => {
  const defaultOptions = getDefaultOptions<void, ResponseType>();
  return merge(defaultOptions, handlerOptions);
};

export const createOptions = <RequestType, ResponseType>(
  handlerOptionsOrFunction: HttpHandlerFunctionOrOptions<
    RequestType,
    ResponseType
  >,
): HttpHandlerFunctionBuiltOptions<RequestType, ResponseType> => {
  const defaultOptions = getDefaultOptions<RequestType, ResponseType>();
  if (typeof handlerOptionsOrFunction === "function") {
    return {
      ...defaultOptions,
      handler: handlerOptionsOrFunction,
    };
  } else {
    return merge(defaultOptions, handlerOptionsOrFunction);
  }
};
