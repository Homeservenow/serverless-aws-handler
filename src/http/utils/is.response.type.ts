import { APIGatewayProxyResult } from "aws-lambda";

export const isResponseType = (obj: any): obj is APIGatewayProxyResult =>
  obj &&
  typeof obj === "object" &&
  (obj.hasOwnProperty("statusCode") ||
    obj.hasOwnProperty("body") ||
    obj.hasOwnProperty("headers") ||
    obj.hasOwnProperty("status"));
