import { SQSRecord } from "aws-lambda";

export type SqsFilterUniqueRecordsFunction = (
  records: SQSRecord[],
) => SQSRecord[];

export const filterUniqueRecords: SqsFilterUniqueRecordsFunction = (
  records: SQSRecord[],
): SQSRecord[] => records;
