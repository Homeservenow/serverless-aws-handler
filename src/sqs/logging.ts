export type LoggingFunction = (error: any) => void;

export const logger: LoggingFunction = (error: any): void => {
  console.error({
    severity: "error",
    error,
  });
};
