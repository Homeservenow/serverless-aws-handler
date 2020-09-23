import { HttpErrorException } from "./../exceptions";

export const isHttpErrorException = (obj: any): obj is HttpErrorException =>
  obj instanceof HttpErrorException;
