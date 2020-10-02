import { SQSRecord } from "aws-lambda";

export type SqsSerialiseFunction<R extends any> = (record: SQSRecord) => R;

export const serialise: SqsSerialiseFunction<any> = (record: SQSRecord): any =>
  JSON.parse(record.body) as any;
