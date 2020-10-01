import { SQSEvent } from "aws-lambda";

export const mockSQSEvent = ({ ...args }: Partial<SQSEvent>): SQSEvent => ({
  Records: [],
  ...args,
});
