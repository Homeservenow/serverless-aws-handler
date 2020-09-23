import { SQSRecord } from "aws-lambda";
import { SqsDeleteRecords } from "./delete.records";
import { SqsFilterUniqueRecordsFunction } from "./filter.unique";
import { SqsSerialiseFunction } from "./sqs.serialise";

export enum SQSHandle {
  DEAD_LETTER = "DEAD_LETTER",
  DELETE = "DELETE",
}

export type RecordResults = {
  record: SQSRecord;
  result: SQSHandle;
};

export type SqsHandlerFunction = <T>(payload: T) => Promise<SQSHandle>;

export interface SqsHandlerOptionsInterface {
  handler: SqsHandlerFunction;
  serialise: SqsSerialiseFunction;
  filterUniqueRecords: SqsFilterUniqueRecordsFunction;
  deleteRecords: SqsDeleteRecords;
}
