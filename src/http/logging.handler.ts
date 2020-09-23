import { HttpStatusCode } from "./enums";
import { HttpErrorException } from "./exceptions";
import { isHttpErrorException } from "./utils";

export type ErrorHandlingOptionsType =
  | HttpStatusCode
  | [HttpStatusCode, HttpStatusCode]
  | {
      whitelist?: HttpStatusCode[];
      blacklist?: HttpStatusCode[];
    }
  | boolean;

export interface LoggerInterface {
  log: Function;
  warn: Function;
  error: Function;
}

export type LoggerFunction = (
  errorHandlingOptions: ErrorHandlingOptionsType,
  error: Error | HttpErrorException,
) => void;

class DefaultLogger implements LoggerInterface {
  log = (message: string) =>
    console.log(JSON.stringify({ message, level: "log" }));
  warn = (message: string) =>
    console.warn(JSON.stringify({ message, level: "warn" }));
  error = (message: string) =>
    console.error(JSON.stringify({ message, level: "error" }));
}

export const createLoggingHandler = (
  customLoger?: LoggerInterface,
): LoggerFunction => {
  const logger = customLoger ? customLoger : new DefaultLogger();

  return (
    errorHandlingOptions: ErrorHandlingOptionsType,
    error: Error | HttpErrorException,
  ): void => {
    let log: boolean = false;
    const statusCode = isHttpErrorException(error) ? error.status : 500;

    if (errorHandlingOptions) {
      switch (typeof errorHandlingOptions) {
        case "object":
          if (Array.isArray(errorHandlingOptions)) {
            if (
              (statusCode &&
                statusCode > errorHandlingOptions[0] &&
                statusCode < errorHandlingOptions[1]) ||
              errorHandlingOptions.includes(statusCode)
            ) {
              log = true;
            }
            break;
          }

          if (errorHandlingOptions?.blacklist?.includes(statusCode)) {
            log = false;
          } else {
            if (!errorHandlingOptions.whitelist) {
              log = true;
            } else if (
              statusCode &&
              errorHandlingOptions?.whitelist.includes(statusCode)
            ) {
              log = true;
            }
          }
          break;

        case "number":
          if (statusCode === errorHandlingOptions) {
            log = true;
          }
          break;
        case "boolean":
          log = errorHandlingOptions;
      }
      if (log) {
        logger.log(error.message);
        if (error.stack) {
          logger.error(error.stack);
        }
      }
    }
  };
};
