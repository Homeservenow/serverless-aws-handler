import { SQSRecord } from "aws-lambda";

export type SqsSerialiseFunction = <R>(record: SQSRecord) => R;

export const serialise: SqsSerialiseFunction = <R>(record: SQSRecord): R =>
  JSON.parse(record.body) as R;
