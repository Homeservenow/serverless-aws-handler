import { HttpStatusCode } from "./enum";
import { ErrorHandlingOptionsType, LoggerFunction } from "./logging.handler";
import { ErrorHandlerFunction } from "./http.error.handler";
import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";

export type ValidatorFunction<Payload> = (value: any) => Payload;

export interface HttpErrorResponseInterface extends Error {
  readonly status: HttpStatusCode;
  readonly data?: any;
}

export type ResponseSerialiserFunction<ResponseType> = (
  value: ResponseType | Partial<APIGatewayProxyResult> | any,
) => string;

export type HttpHandlerInput<RequestType> = {
  body: RequestType;
  event: APIGatewayEvent;
  context: Context;
};

export type HttpHandlerFunction<RequestType, ResponseType> = (
  input: HttpHandlerInput<RequestType>,
) => Promise<void | Partial<APIGatewayProxyResult> | ResponseType>;

export interface HttpHandlerDecoratorBuiltOptions<ResponseType> {
  defaultStatusCode?: HttpStatusCode;
  defaultOutputHeaders?: { [s: string]: string };
  errorHandler: ErrorHandlerFunction;
  logger: LoggerFunction;
  loggingOptions: ErrorHandlingOptionsType;
  serialise: {
    output: ResponseSerialiserFunction<ResponseType>;
  };
}

export type HttpHandlerDecoratorOptions<ResponseType> = Partial<
  HttpHandlerDecoratorBuiltOptions<ResponseType>
>;

export interface HttpHandlerOptions<RequestType, ResponseType>
  extends HttpHandlerDecoratorOptions<ResponseType> {
  validator?: ValidatorFunction<RequestType>;
  handler: HttpHandlerFunction<RequestType, ResponseType>;
}

export type HttpHandlerFunctionOrOptions<RequestType, ResponseType> =
  | HttpHandlerOptions<RequestType, ResponseType>
  | HttpHandlerFunction<RequestType, ResponseType>;

export interface HttpHandlerDefaultOptions<RequestType, ResponseType> {
  errorHandler: ErrorHandlerFunction;
  defaultStatusCode: HttpStatusCode;
  logger: LoggerFunction;
  loggingOptions: ErrorHandlingOptionsType;
  validator: ValidatorFunction<RequestType>;
  serialise: {
    input: (value: APIGatewayEvent) => any;
    output: ResponseSerialiserFunction<ResponseType>;
  };
}

export interface HttpHandlerFunctionBuiltOptions<RequestType, ResponseType>
  extends HttpHandlerDefaultOptions<RequestType, ResponseType> {
  defaultOutputHeaders?: { [s: string]: string };
  handler: HttpHandlerFunction<RequestType, ResponseType>;
}
