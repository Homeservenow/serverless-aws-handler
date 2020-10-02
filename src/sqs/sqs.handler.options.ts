import { deleteRecords } from "./delete.records";
import { filterUniqueRecords } from "./filter.unique";
import { SqsHandlerFunction, SqsHandlerOptionsInterface } from "./interfaces";
import { logger } from "./logging";
import { serialise } from "./sqs.serialise";

export type PartialSqsHandlerOptions<T> = Partial<
  SqsHandlerOptionsInterface<T>
> & {
  handler: SqsHandlerFunction<T>;
};

export const resolveSqsOptions = <T>(
  options: Partial<SqsHandlerOptionsInterface<T>> & {
    handler: SqsHandlerFunction<T>;
  },
): SqsHandlerOptionsInterface<T> => ({
  handler: options.handler,
  serialise: options.serialise || serialise,
  filterUniqueRecords: options.filterUniqueRecords || filterUniqueRecords,
  deleteRecords: options.deleteRecords || deleteRecords,
  logging: options.logging || logger,
  deadletterQueue: options.deadletterQueue || false,
  exceptionHandler: options.exceptionHandler,
});
