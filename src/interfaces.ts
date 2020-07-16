import { HttpStatusCode } from "./enum";
import { ValidatorFunction } from "./validator";
import { APIGatewayJsonEvent } from "./utils/json.parse";
import { ErrorHandlingType, LoggerFunction } from "./logging.handler";
import { ErrorHandlerFunction } from "./http.error.handler";
import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";

export interface HttpErrorResponseInterface extends Error {
  readonly status: HttpStatusCode;
  readonly data?: any;
}

export type ResponseSerialiserFunction<ResponseType> = (
  value: ResponseType | APIGatewayProxyResult | Partial<APIGatewayProxyResult>,
) => string;

export type HttpHandlerFunction<RequestType, ResponseType> = (
  event?: APIGatewayEvent | APIGatewayJsonEvent<RequestType>,
  context?: Context,
) => Promise<
  void | Partial<APIGatewayProxyResult> | APIGatewayProxyResult | ResponseType
>;

export type HttpHandlerOptions<ResponseType> = {
  errorHandler?: ErrorHandlerFunction;
  defaultStatusCode?: HttpStatusCode;
  defaultHeaders?: { [s: string]: string };
  logger?: LoggerFunction;
  validator?: ValidatorFunction;
  serialise?: {
    input?: (value: APIGatewayEvent) => APIGatewayEvent;
    output?: ResponseSerialiserFunction<ResponseType>;
  };
  loggingHandlingOpions?: ErrorHandlingType;
};

export type HttpHandlerFunctionOptions<RequestType, ResponseType> =
  | ({
      handler: HttpHandlerFunction<RequestType, ResponseType>;
    } & HttpHandlerOptions<ResponseType>)
  | HttpHandlerFunction<RequestType, ResponseType>;
