import { SQSHandleActions } from "./../sqs";
import { httpConfig, sqsConfig } from ".";
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
  describe("httpConfig", () => {
    it("basic instance", () => {
      const result = httpConfig({});

      expect(typeof result).toBe("function");
    });

    it("handler function", () => {
      const result = httpConfig({});

      const handler = result(async () => {});

      expect(typeof handler).toBe("function");
    });
  });

  describe("sqsConfig", () => {
    let sqs: SQS;
    beforeAll(() => {
      sqs = new SQS();
    });

    it("basic instance", () => {
      const result = sqsConfig({
        SQS: sqs,
      });

      expect(typeof result).toBe("function");
    });

    it("handler function", () => {
      const result = sqsConfig({
        SQS: sqs,
      });

      const handler = result(async () => {
        return SQSHandleActions.DELETE;
      });

      expect(typeof handler).toBe("function");
    });
  });
});
