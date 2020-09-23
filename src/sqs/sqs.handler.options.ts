import { deleteRecords } from "./delete.records";
import { filterUniqueRecords } from "./filter.unique";
import { SqsHandlerFunction, SqsHandlerOptionsInterface } from "./interfaces";
import { serialise } from "./sqs.serialise";

export type PartialSqsHandlerOptions = Partial<SqsHandlerOptionsInterface> & {
  handler: SqsHandlerFunction;
};

export const resolveSqsOptions = (
  options: Partial<SqsHandlerOptionsInterface> & {
    handler: SqsHandlerFunction;
  },
): SqsHandlerOptionsInterface => ({
  handler: options.handler,
  serialise: options.serialise || serialise,
  filterUniqueRecords: options.filterUniqueRecords || filterUniqueRecords,
  deleteRecords: options.deleteRecords || deleteRecords,
});
