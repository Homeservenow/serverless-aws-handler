import { isObject } from "./utils";
import { HttpStatusCode } from "./enums";
import { APIGatewayProxyResult } from "aws-lambda";
import {
  DefaultHeadersInterface,
  ResponseSerialiserFunction,
} from "./interfaces";

export const httpResponsePayloadSerialiser: ResponseSerialiserFunction<any> = (
  payload: any,
): string => (isObject(payload) ? JSON.stringify(payload) : String(payload));

export const httpResponseBuilder = (
  payload: any,
  statusCode: HttpStatusCode,
  httpResponsePayloadSerialiser: ResponseSerialiserFunction<any>,
  headers?: DefaultHeadersInterface,
): APIGatewayProxyResult => ({
  body: httpResponsePayloadSerialiser(payload),
  statusCode,
  headers,
});
