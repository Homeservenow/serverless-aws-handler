import {
  httpHandler,
  NotFoundException,
  HttpStatusCode,
  UnprocessableEntityException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  InternalServerError,
} from "..";
import { createMockAPIGatewayEvent } from "./events";
import * as mockContext from "aws-lambda-mock-context";

const testHttpMethod = httpHandler(async () => {
  return {
    test: true,
  };
});

describe("HttpHandler", () => {
  const context = mockContext();

  it("Will return 200", async () => {
    const result = await testHttpMethod(
      createMockAPIGatewayEvent({}),
      context,
      () => {},
    );

    expect(result && result.statusCode).toBe(HttpStatusCode.OK);
  });

  it("Can have different default return value", async () => {
    const testHttpMethod = httpHandler({
      handler: async () => {
        return {
          test: true,
        };
      },
      defaultStatusCode: HttpStatusCode.NO_CONTENT,
    });

    const result = await testHttpMethod(
      createMockAPIGatewayEvent({}),
      context,
      () => {},
    );

    expect(result && result.statusCode).toBe(HttpStatusCode.NO_CONTENT);
  });

  describe("Can return http exceptions using exceptions", () => {
    it("NotFoundException", async () => {
      const testHttpMethod = httpHandler(async () => {
        throw new NotFoundException();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
        () => {},
      );

      expect(result && result.statusCode).toBe(HttpStatusCode.NOT_FOUND);
    });

    it("UnprocessableEntityException", async () => {
      const testHttpMethod = httpHandler(async () => {
        throw new UnprocessableEntityException();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
        () => {},
      );

      expect(result && result.statusCode).toBe(
        HttpStatusCode.UNPROCESSABLE_ENTITY,
      );
    });

    it("BadRequestException", async () => {
      const testHttpMethod = httpHandler(async () => {
        throw new BadRequestException();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
        () => {},
      );

      expect(result && result.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it("UnauthorizedException", async () => {
      const testHttpMethod = httpHandler(async () => {
        throw new UnauthorizedException();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
        () => {},
      );

      expect(result && result.statusCode).toBe(HttpStatusCode.UNAUTHORIZED);
    });

    it("InternalServerException", async () => {
      const testHttpMethod = httpHandler(async () => {
        throw new Error();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
        () => {},
      );

      expect(result && result.statusCode).toBe(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    });

    it("InternalServerException", async () => {
      const testHttpMethod = httpHandler(async () => {
        throw new InternalServerError();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
        () => {},
      );

      expect(result && result.statusCode).toBe(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    });

    it("ForbiddenException", async () => {
      const testHttpMethod = httpHandler(async () => {
        throw new ForbiddenException();

        return {
          test: true,
        };
      });

      const result = await testHttpMethod(
        createMockAPIGatewayEvent({}),
        context,
        () => {},
      );

      expect(result && result.statusCode).toBe(HttpStatusCode.FORBIDDEN);
    });
  });

  describe("Can override default response", () => {
    it("Can return response object with statusCode", async () => {
      const testHttpMethod = httpHandler(async () => {
        return {
          statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
        };
      });

      expect(
        await testHttpMethod(createMockAPIGatewayEvent({}), context, () => {}),
      ).toStrictEqual({ statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY });
    });

    it("Can return response object with body", async () => {
      const testHttpMethod = httpHandler(async () => {
        return {
          body: "test",
        };
      });

      expect(
        await testHttpMethod(createMockAPIGatewayEvent({}), context, () => {}),
      ).toStrictEqual({ body: "test", statusCode: 200 });
    });

    it("Can return response object with body, statusCode and headers", async () => {
      const testHttpMethod = httpHandler(async () => {
        return {
          statusCode: HttpStatusCode.SUCCESS,
          body: {
            someString: "hello",
          },
          headers: {
            ["X-Some-Header"]: "test",
          },
        };
      });

      expect(
        await testHttpMethod(createMockAPIGatewayEvent({}), context, () => {}),
      ).toStrictEqual({
        body: '{"someString":"hello"}',
        statusCode: 201,
        headers: { ["X-Some-Header"]: "test" },
      });
    });
  });

  describe("Can return additional exception data", () => {
    it("Can return validation errors", async () => {
      const validationErrorsHanlder = httpHandler<{ name?: string }, void>(
        async ({ event, payload }) => {
          if (!event.body || !payload.name) {
            throw new BadRequestException("Validation errors", [
              {
                target: payload,
                property: "name",
                value: payload.name,
                reason: "Name is required",
              },
            ]);
          }

          console.log("valid", payload.name);
        },
      );

      expect(
        await validationErrorsHanlder(
          createMockAPIGatewayEvent({
            body: "{}",
          }),
          context,
          () => {},
        ),
      ).toStrictEqual({
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: JSON.stringify({
          message: "Validation errors",
          data: [
            {
              target: {},
              property: "name",
              value: undefined,
              reason: "Name is required",
            },
          ],
        }),
        headers: undefined,
      });
    });
  });
});
