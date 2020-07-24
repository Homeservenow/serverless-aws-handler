import { isUndefined } from "./is.undefined";

export const isNil = (obj: any): obj is null | undefined =>
  isUndefined(obj) || obj === null;
