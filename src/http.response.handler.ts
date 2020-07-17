import { isObject } from "./utils";
import { HttpStatusCode } from "./enum";
import { APIGatewayProxyResult } from "aws-lambda";
import { ResponseSerialiserFunction } from "./interfaces";

export const httpResponsePayloadHandler: ResponseSerialiserFunction<any> = (
  payload: any,
): string => (isObject(payload) ? JSON.stringify(payload) : String(payload));

export const httpResponseHandler = (
  payload: any,
  statusCode: HttpStatusCode,
  httpResponsePayloadHandler: ResponseSerialiserFunction<any>,
  headers?: { [s: string]: string },
): APIGatewayProxyResult => ({
  body: httpResponsePayloadHandler(payload),
  statusCode,
  headers,
});
