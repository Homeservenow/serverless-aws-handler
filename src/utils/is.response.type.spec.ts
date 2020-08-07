import { isResponseType } from "./is.response.type";
import { HttpStatusCode } from "./../enums";

describe("isResponseType", () => {
  it("Can process undefined", () => {
    expect(isResponseType(undefined)).toBeFalsy();
  });

  it("Can return true if body", () => {
    expect(
      isResponseType({
        body: {},
      }),
    ).toBeTruthy();
  });

  it("Can return true if headers", () => {
    expect(
      isResponseType({
        headers: {},
      }),
    ).toBeTruthy();
  });

  it("Can return true if status", () => {
    expect(
      isResponseType({
        status: HttpStatusCode.NO_CONTENT,
      }),
    ).toBeTruthy();
  });
});
