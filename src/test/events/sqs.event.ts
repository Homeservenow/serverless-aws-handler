import { SQSEvent, SQSRecord } from "aws-lambda";

export const mockSQSEvent = ({ ...args }: Partial<SQSEvent>): SQSEvent => ({
  Records: [],
  ...args,
});

export const mockSQSRecord = ({ ...args }: Partial<SQSRecord>): SQSRecord => ({
  messageId: "123456",
  body: "{}",
  receiptHandle: "",
  eventSource: "",
  attributes: {
    SenderId: "1234",
    ApproximateReceiveCount: "0",
    SentTimestamp: "",
    ApproximateFirstReceiveTimestamp: "",
  },
  messageAttributes: {},
  md5OfBody: "",
  awsRegion: "eu-west-1",
  eventSourceARN: "",
  ...args,
});
