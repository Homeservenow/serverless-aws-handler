import { RecordResults, SQSHandleActions, SQSHandler } from "../../sqs";
import AWS, { SQS } from "aws-sdk";
import { mockSQSEvent, mockSQSRecord } from "../events/sqs.event";
import mockContext from "aws-lambda-mock-context";
import { SQSRecord } from "aws-lambda";

jest.mock("aws-sdk", () => {
  const SQSMocked: Partial<SQS> & { promise: any } = {
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
    SQS: jest.fn(() => SQSMocked),
  };
});

type Test = {};

describe("SqsHandler", () => {
  let sqs: AWS.SQS;

  beforeAll(() => {
    sqs = new AWS.SQS();
  });

  beforeEach(() => {
    (sqs.deleteMessageBatch().promise as jest.MockedFunction<any>).mockReset();
  });

  it("Successfully call sqsHandler", async () => {
    const records = mockSQSEvent({
      Records: [mockSQSRecord({})],
    });
    const context = mockContext();

    const handler = SQSHandler<Test>(sqs)(
      (record: Test): Promise<SQSHandleActions> => {
        return Promise.resolve(SQSHandleActions.DELETE);
      },
    );

    try {
      await handler(records, context, () => {});
      expect(true).toBeTruthy();
    } catch {
      expect(false).toBeTruthy();
    }
  });

  it("handle delete", async () => {
    const records = mockSQSEvent({
      Records: [mockSQSRecord({})],
    });
    const context = mockContext();

    (sqs.deleteMessageBatch().promise as jest.MockedFunction<
      any
    >).mockResolvedValueOnce({
      Successfully: [
        {
          Id: "123456",
        },
      ],
    });

    const handler = SQSHandler<Test>(sqs)(
      (record: Test): Promise<SQSHandleActions> => {
        return Promise.resolve(SQSHandleActions.DELETE);
      },
    );

    await handler(records, context, () => {});

    expect(sqs.deleteMessageBatch().promise).toHaveBeenCalled();
  });

  it("Exception handler", async () => {
    const records = mockSQSEvent({
      Records: [mockSQSRecord({})],
    });
    const context = mockContext();

    (sqs.deleteMessageBatch().promise as jest.MockedFunction<
      any
    >).mockResolvedValueOnce({
      Successfully: [
        {
          Id: "123456",
        },
      ],
    });

    const handler = SQSHandler<Test>(sqs)({
      handler: (record: Test): Promise<SQSHandleActions> => {
        throw new Error("yeaaa boi");

        return Promise.resolve(SQSHandleActions.DELETE);
      },
      exceptionHandler: async (record: SQSRecord): Promise<RecordResults> => {
        expect(true).toBeTruthy();

        return Promise.resolve({ record, result: SQSHandleActions.DELETE });
      },
    });

    await handler(records, context, () => {});

    expect(sqs.deleteMessageBatch).toHaveBeenCalledWith({
      Entries: [
        {
          Id: "123456",
          ReceiptHandle: "",
        },
      ],
      QueueUrl: "undefined/undefined",
    });
  });
  it("With generic", async () => {
    type TestType = {
      test: boolean;
    };

    const records = mockSQSEvent({
      Records: [
        mockSQSRecord({
          body: JSON.stringify({ test: true }),
        }),
      ],
    });
    const context = mockContext();

    const handler = SQSHandler<TestType>(sqs)({
      handler: (record: TestType): Promise<SQSHandleActions> => {
        throw new Error("yeaaa boi");

        return Promise.resolve(SQSHandleActions.DELETE);
      },
      exceptionHandler: async (record: SQSRecord): Promise<RecordResults> => {
        expect(true).toBeTruthy();

        return Promise.resolve({ record, result: SQSHandleActions.DELETE });
      },
    });

    await handler(records, context, () => {});

    expect(sqs.deleteMessageBatch).toHaveBeenCalledWith({
      Entries: [
        {
          Id: "123456",
          ReceiptHandle: "",
        },
      ],
      QueueUrl: "undefined/undefined",
    });
  });
});
