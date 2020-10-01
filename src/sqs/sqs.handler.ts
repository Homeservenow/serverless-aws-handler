import { SQSEvent, SQSHandler as AWSSQSHandler } from "aws-lambda";
import { SQS } from "aws-sdk";
import { RecordResults, SQSHandle, SqsHandlerFunction } from "./interfaces";
import {
  PartialSqsHandlerOptions,
  resolveSqsOptions,
} from "./sqs.handler.options";

export const SQSHandler = (sqs: SQS) => <T extends any>(
  handler: SqsHandlerFunction | PartialSqsHandlerOptions,
): AWSSQSHandler => {
  const options = resolveSqsOptions(
    typeof handler === "function" ? { handler } : handler,
  );

  return async (event: SQSEvent) => {
    const records = options.filterUniqueRecords(event.Records);

    const results: RecordResults[] = await Promise.all(
      records.map(async (record) => {
        try {
          const payload = options.serialise<T>(record);

          return { record, result: await options.handler<T>(payload) };
        } catch (error) {
          options.logging(error);
          return options.exceptionHandler
            ? options.exceptionHandler(record)
            : { record, result: SQSHandle.DEAD_LETTER };
        }
      }),
    );

    await options.deleteRecords(
      sqs,
      results.filter((result) => result.result === SQSHandle.DELETE),
    );
  };
};
