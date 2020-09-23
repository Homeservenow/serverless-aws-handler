import { JSONParse } from "./../http/utils";
import { HttpStatusCode } from "./../http/enums";
import { createMockAPIGatewayEvent } from "./events";

describe("JSONParse", () => {
  it("Can receive malformed exception", () => {
    let exception;
    try {
      JSONParse(
        createMockAPIGatewayEvent({
          body: '["test" : 123]',
        }),
      );
    } catch (e) {
      exception = e;
    }
    expect(exception.status).toBe(HttpStatusCode.BAD_REQUEST);
  });
});
