import { SQSRecord } from "aws-lambda";
import { LoggingFunction } from "./logging";
import { SqsDeleteRecords } from "./delete.records";
import { SqsFilterUniqueRecordsFunction } from "./filter.unique";
import { SqsSerialiseFunction } from "./sqs.serialise";

export enum SQSHandleActions {
  DEAD_LETTER = "DEAD_LETTER",
  DELETE = "DELETE",
}

export type RecordResults = {
  record: SQSRecord;
  result: SQSHandleActions;
};

export type SqsHandlerFunction<T extends any> = (
  payload: T,
) => Promise<SQSHandleActions>;

export type DeadletterQueueOptions = {
  Queue: string;
};

export type ExceptionHandlerFunction = (
  record: SQSRecord,
) => Promise<RecordResults>;

export interface SqsHandlerOptionsInterface<T> {
  handler: SqsHandlerFunction<T>;
  serialise: SqsSerialiseFunction<T>;
  filterUniqueRecords: SqsFilterUniqueRecordsFunction;
  deleteRecords: SqsDeleteRecords;
  logging: LoggingFunction;
  deadletterQueue: false | DeadletterQueueOptions;
  exceptionHandler?: ExceptionHandlerFunction;
}
