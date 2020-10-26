import { SQS } from "aws-sdk";
import {
  httpHandler,
  HttpHandlerFunction,
  HttpHandlerOptions as HttpHandlerOptionsWithHandler,
  PromisifiedAPIGatewayProxyHandler,
} from "./../http";
import {
  SQSHandler,
  SqsHandlerFunction,
  SqsHandlerOptionsInterface as SqsHandlerOptionsInterfaceWithHandler,
} from "./../sqs";
import { SQSHandler as AWSSQSHandler } from "aws-lambda";

type SqsHandlerOptionsInterface<T> = Partial<
  Omit<SqsHandlerOptionsInterfaceWithHandler<T>, "handler">
> & { SQS: SQS };
type HttpHandlerOptions<T, R> = Omit<
  HttpHandlerOptionsWithHandler<T, R>,
  "handler"
>;

type ConfigCacheHttpFunction = <T, R>(
  options: HttpHandlerOptions<T, R>,
) => (handler: HttpHandlerFunction<T, R>) => PromisifiedAPIGatewayProxyHandler;
type ConfigCacheSQSFunction = <R>(
  options: SqsHandlerOptionsInterface<R>,
) => (handler: SqsHandlerFunction<R>) => AWSSQSHandler;
type ConfigCacheFunction = ConfigCacheHttpFunction | ConfigCacheSQSFunction;

export const httpConfigFactory: ConfigCacheHttpFunction = <T, R>(
  options: HttpHandlerOptions<T, R>,
) => (handler: HttpHandlerFunction<T, R>) =>
  httpHandler({
    ...options,
    handler,
  });

export const sqsConfigFactory: ConfigCacheSQSFunction = <R>(
  options: SqsHandlerOptionsInterface<R>,
) => (handler: SqsHandlerFunction<R>) =>
  SQSHandler<R>(options.SQS)({
    ...options,
    handler,
  });
