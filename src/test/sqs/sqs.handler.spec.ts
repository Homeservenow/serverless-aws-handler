import { SQSHandle, SQSHandler } from "../../sqs";
import AWS, { SQS } from 'aws-sdk';
import { mockSQSEvent } from "../events/sqs.event";
import mockContext from "aws-lambda-mock-context";

jest.mock('aws-sdk', () => {
  const SQSMocked: Partial<SQS> & {promise: any} = {
    sendMessage: jest.fn().mockReturnThis(),
    deleteMessageBatch: jest.fn().mockReturnThis(),
    promise: jest.fn(),
    endpoint: {
      href: "",
      host: "",
      hostname: "",
      port: 1234,
      protocol: "",
    },
  };
  return {
    SQS: jest.fn(() => SQSMocked)
  };
});

describe('SqsHandler', () => {
  let sqs: AWS.SQS;

  beforeAll(() => {
    sqs = new AWS.SQS();
  });

  it("Successfully call sqsHandler", async () => {

    const records = mockSQSEvent({
      Records: [{
        messageId: "123456",
        body: "{}",
        receiptHandle: "",
        eventSource: "",
        attributes: {
          SenderId: "1234",
          ApproximateReceiveCount: '0',
          SentTimestamp: '',
          ApproximateFirstReceiveTimestamp: '',
        },
        messageAttributes: {

        },
        md5OfBody: "",
        awsRegion: "eu-west-1",
        eventSourceARN: "",
      }],
    });
    const context = mockContext();
    
    const handler = SQSHandler(sqs)(<Test>(record: Test): Promise<SQSHandle> => {
      console.log('record', record)
      return Promise.resolve(SQSHandle.DELETE);
    });

    try {
      await handler(records, context, () => {});
      expect(true).toBeTruthy();
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it('handle delete', async () => {
    const records = mockSQSEvent({
      Records: [{
        messageId: "123456",
        body: "{}",
        receiptHandle: "",
        eventSource: "",
        attributes: {
          SenderId: "1234",
          ApproximateReceiveCount: '0',
          SentTimestamp: '',
          ApproximateFirstReceiveTimestamp: '',
        },
        messageAttributes: {

        },
        md5OfBody: "",
        awsRegion: "eu-west-1",
        eventSourceARN: "",
      }],
    });
    const context = mockContext();

    (sqs.deleteMessageBatch().promise as jest.MockedFunction<any>).mockResolvedValueOnce({
      Successfully: [
        {
          Id: "123456",
        },
      ],
    });
    
    const handler = SQSHandler(sqs)(<Test>(record: Test): Promise<SQSHandle> => {
      console.log('record', record)
      return Promise.resolve(SQSHandle.DELETE);
    });

    const result = await handler(records, context, () => {});

    expect(sqs.deleteMessageBatch().promise).toHaveBeenCalled();
  });
});