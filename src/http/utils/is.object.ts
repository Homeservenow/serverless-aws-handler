import { isNil } from "./is.nil";

export const isObject = (fn: any): fn is object =>
  !isNil(fn) && typeof fn === "object";
