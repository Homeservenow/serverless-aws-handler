import { Context } from "aws-lambda";

export const context: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "",
  functionVersion: "",
  invokedFunctionArn: "",
  memoryLimitInMB: "",
  awsRequestId: "",
  logGroupName: "",
  logStreamName: "",
  getRemainingTimeInMillis: (): number => 1,
  done: (error?: Error, result?: any): void => {},
  fail: (error: Error | string): void => {},
  succeed: (messageOrObject: any): void => {},
};
