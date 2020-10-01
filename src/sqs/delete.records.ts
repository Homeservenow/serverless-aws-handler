import { AWSError, SQS } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { RecordResults } from "./interfaces";

export const getQueueUrl = (sqs: SQS, eventSourceARN: string) => {
  const [, , , , accountId, queueName] = eventSourceARN.split(":");
  return `${sqs.endpoint.href}${accountId}/${queueName}`;
};

export type SqsDeleteRecords = (
  sqs: SQS,
  records: RecordResults[],
) => Promise<void | PromiseResult<SQS.DeleteMessageBatchResult, AWSError>>;

export const deleteRecords: SqsDeleteRecords = async (
  sqs: SQS,
  records: RecordResults[],
): Promise<void | PromiseResult<SQS.DeleteMessageBatchResult, AWSError>> => {
  if (records.length === 0) return Promise.resolve();

  const QueueUrl = getQueueUrl(sqs, records[0].record.eventSourceARN);

  return sqs
    .deleteMessageBatch({
      Entries: records.map((result) => ({
        Id: result.record.messageId,
        ReceiptHandle: result.record.receiptHandle,
      })),
      QueueUrl,
    })
    .promise();
};
