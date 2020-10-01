import { SQSHandle, SQSHandler } from "../../sqs";
import AWS from 'aws-sdk';
import { mockSQSEvent } from "../events/sqs.event";
import mockContext from "aws-lambda-mock-context";

describe('SqsHandler', () => {
  let sqs: AWS.SQS;

  beforeAll(() => {
    sqs = new AWS.SQS();
  });

  it("sqs handler", async () => {

    const records = mockSQSEvent({});
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
});
