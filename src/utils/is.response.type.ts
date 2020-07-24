import { APIGatewayProxyResult } from "aws-lambda";

export const isResponseType = (obj: any): obj is APIGatewayProxyResult =>
  obj.hasOwnProperty("statusCode") || obj.hasOwnProperty("body");
