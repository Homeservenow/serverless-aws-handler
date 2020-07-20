import { isObject } from "./utils";
import { HttpStatusCode } from "./enum";
import { APIGatewayProxyResult } from "aws-lambda";
import { ResponseSerialiserFunction } from "./interfaces";

export const httpResponsePayloadSerialiser: ResponseSerialiserFunction<any> = (
  payload: any,
): string => (isObject(payload) ? JSON.stringify(payload) : String(payload));

export const httpResponseBuilder = (
  payload: any,
  statusCode: HttpStatusCode,
  httpResponsePayloadSerialiser: ResponseSerialiserFunction<any>,
  headers?: { [s: string]: string },
): APIGatewayProxyResult => ({
  body: httpResponsePayloadSerialiser(payload),
  statusCode,
  headers,
});
