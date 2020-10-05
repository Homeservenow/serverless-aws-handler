import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";
import { HttpHandlerDecorator } from "../../http/decorator";
import { createMockAPIGatewayEvent } from "../events";
import { HttpStatusCode } from "../../http/enums";
import { context } from "./../events/mock.context";

describe("Decorator", () => {
  class TestDecorator {
    @HttpHandlerDecorator()
    static async test(
      event: APIGatewayProxyEvent,
      context: Context,
    ): Promise<APIGatewayProxyResult> {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foo: "bar" }),
      };
    }

    @HttpHandlerDecorator()
    static async testThrows(
      event: APIGatewayProxyEvent,
      context: Context,
    ): Promise<APIGatewayProxyResult> {
      throw new Error("uh oh");
    }
  }

  it("Works when the function returns normally", async () => {
    const event = createMockAPIGatewayEvent({});
    await expect(
      TestDecorator.test(
        createMockAPIGatewayEvent({ body: { foo: "bar " } }),
        context,
      ),
    ).resolves.toEqual({
      body: '{"foo":"bar"}',
      statusCode: HttpStatusCode.OK,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("Works when the function returns normally", async () => {
    const event = createMockAPIGatewayEvent({});
    await expect(
      TestDecorator.testThrows(
        createMockAPIGatewayEvent({ body: { foo: "bar " } }),
        context,
      ),
    ).resolves.toEqual({
      body: JSON.stringify({ message: "uh oh" }),
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  });
});
