import { HttpStatusCode } from "./enum";
import { ValidatorFunction } from "./validator";
import { ErrorHandlingOptionsType, LoggerFunction } from "./logging.handler";
import { ErrorHandlerFunction } from "./http.error.handler";
import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";

export interface HttpErrorResponseInterface extends Error {
  readonly status: HttpStatusCode;
  readonly data?: any;
}

export type ResponseSerialiserFunction<ResponseType> = (
  value:
    | ResponseType
    | APIGatewayProxyResult
    | Partial<APIGatewayProxyResult>
    | any,
) => string;

export type HttpHandlerFunction<RequestType, ResponseType> = (input: {
  payload: RequestType;
  event: APIGatewayEvent;
  context: Context;
}) => Promise<
  void | Partial<APIGatewayProxyResult> | APIGatewayProxyResult | ResponseType
>;

export type HttpHandlerOptions<RequestType, ResponseType> = {
  errorHandler?: ErrorHandlerFunction;
  defaultStatusCode?: HttpStatusCode;
  defaultHeaders?: { [s: string]: string };
  logger?: LoggerFunction;
  validator?: ValidatorFunction<RequestType>;
  serialise?: {
    input?: (value: APIGatewayEvent) => any;
    output?: ResponseSerialiserFunction<ResponseType>;
  };
  loggingHandlingOpions?: ErrorHandlingOptionsType;
};

export type HttpHandlerFunctionOptions<RequestType, ResponseType> =
  | ({
      handler: HttpHandlerFunction<RequestType, ResponseType>;
    } & HttpHandlerOptions<RequestType, ResponseType>)
  | HttpHandlerFunction<RequestType, ResponseType>;

export type HttpHandlerFunctionBuiltOptions<RequestType, ResponseType> = {
  errorHandler: ErrorHandlerFunction;
  defaultStatusCode: HttpStatusCode;
  defaultHeaders?: { [s: string]: string };
  logger: LoggerFunction;
  validator?: ValidatorFunction<RequestType>;
  serialise: {
    input?: (value: APIGatewayEvent) => any;
    output?: ResponseSerialiserFunction<ResponseType>;
  };
  loggingHandlingOpions: ErrorHandlingOptionsType;
  handler: HttpHandlerFunction<RequestType, ResponseType>;
};

export type HttpHandlerDefaultOptions<RequestType, ResponseType> = {
  errorHandler: ErrorHandlerFunction;
  defaultStatusCode: HttpStatusCode;
  logger: LoggerFunction;
  validator?: ValidatorFunction<RequestType>;
  serialise: {
    input: (value: APIGatewayEvent) => any;
    output: ResponseSerialiserFunction<ResponseType>;
  };
  loggingHandlingOpions: ErrorHandlingOptionsType;
};
