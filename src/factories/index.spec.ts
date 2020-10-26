import { SQSHandleActions } from "../sqs";
import { httpConfigFactory, sqsConfigFactory } from ".";
import { SQS } from "aws-sdk";

jest.mock("aws-sdk", () => {
  const SQSMocked: Partial<SQS> & { promise: any } = {
    sendMessage: jest.fn().mockReturnThis(),
    deleteMessageBatch: jest.fn().mockReturnThis(),
    promise: jest.fn().mockImplementation(() => Promise.resolve()),
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

describe("config functions", () => {
  describe("httpConfigFactory", () => {
    it("basic instance", () => {
      const result = httpConfigFactory({});

      expect(typeof result).toBe("function");
    });

    it("handler function", () => {
      const result = httpConfigFactory({});

      const handler = result(async () => {});

      expect(typeof handler).toBe("function");
    });
  });

  describe("sqsConfigFactory", () => {
    let sqs: SQS;
    beforeAll(() => {
      sqs = new SQS();
    });

    it("basic instance", () => {
      const result = sqsConfigFactory({
        SQS: sqs,
      });

      expect(typeof result).toBe("function");
    });

    it("handler function", () => {
      const result = sqsConfigFactory({
        SQS: sqs,
      });

      const handler = result(async () => {
        return SQSHandleActions.DELETE;
      });

      expect(typeof handler).toBe("function");
    });
  });
});
