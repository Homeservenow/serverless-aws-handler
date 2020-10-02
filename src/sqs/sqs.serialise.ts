import { SQSRecord } from "aws-lambda";

export type SqsSerialiseFunction<R extends any> = (record: SQSRecord) => R;

export const serialise = (record: SQSRecord) => JSON.parse(record.body) as any;
