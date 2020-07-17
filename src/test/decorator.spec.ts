import { HttpHandlerDecorator } from "./../decorator";
import * as mockContext from "aws-lambda-mock-context";
import { HttpStatusCode } from "./../enum";

describe("Decorator", () => {
  it("Can apply decorator", async () => {
    class TestDecorator {
      @HttpHandlerDecorator({
        serialise: {
          output: (output: any) => `${output} there`,
        },
      })
      static async test({}) {
        return "hello";
      }
    }
    const context = mockContext();

    expect(await TestDecorator.test(context)).toStrictEqual({
      body: "hello there",
      statusCode: HttpStatusCode.OK,
      headers: undefined,
    });
  });
});
