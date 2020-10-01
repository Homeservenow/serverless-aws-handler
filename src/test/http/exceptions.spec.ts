import mockContext from "aws-lambda-mock-context";
import {
  httpHandler,
  HttpStatusCode,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
  UnauthorizedException,
  InternalServerError,
  ForbiddenException,
  ValidationException,
} from "../..";
import { createMockAPIGatewayEvent } from "./../events";

describe("Can return http exceptions using exceptions", () => {
  const context = mockContext();

  it("NotFoundException", async () => {
    const testHttpMethod = httpHandler(async () => {
      throw new NotFoundException();
    });

    const result = await testHttpMethod(createMockAPIGatewayEvent({}), context);

    expect(result.statusCode).toBe(HttpStatusCode.NOT_FOUND);
    expect(result.body).toStrictEqual(JSON.stringify({ message: "Not Found" }));
  });

  it("UnprocessableEntityException", async () => {
    const testHttpMethod = httpHandler(async () => {
      throw new UnprocessableEntityException();
    });

    const result = await testHttpMethod(createMockAPIGatewayEvent({}), context);

    expect(result.statusCode).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
    expect(result.body).toStrictEqual(
      JSON.stringify({ message: "Unprocessable Entity" }),
    );
  });

  it("BadRequestException", async () => {
    const testHttpMethod = httpHandler(async () => {
      throw new BadRequestException();
    });

    const result = await testHttpMethod(createMockAPIGatewayEvent({}), context);

    expect(result.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(result.body).toStrictEqual(
      JSON.stringify({ message: "Bad Request" }),
    );
  });

  it("UnauthorizedException", async () => {
    const testHttpMethod = httpHandler(async () => {
      throw new UnauthorizedException();
    });

    const result = await testHttpMethod(createMockAPIGatewayEvent({}), context);

    expect(result.statusCode).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(result.body).toStrictEqual(
      JSON.stringify({ message: "Unauthorized" }),
    );
  });

  it("InternalServerException", async () => {
    const testHttpMethod = httpHandler(async () => {
      throw new Error();
    });

    const result = await testHttpMethod(createMockAPIGatewayEvent({}), context);

    expect(result.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
  });

  it("InternalServerException", async () => {
    const testHttpMethod = httpHandler(async () => {
      throw new InternalServerError();
    });

    const result = await testHttpMethod(createMockAPIGatewayEvent({}), context);

    expect(result.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(result.body).toStrictEqual(
      JSON.stringify({ message: "Internal Server Error" }),
    );
  });

  it("ForbiddenException", async () => {
    const testHttpMethod = httpHandler(async () => {
      throw new ForbiddenException();
    });

    const result = await testHttpMethod(createMockAPIGatewayEvent({}), context);

    expect(result.statusCode).toBe(HttpStatusCode.FORBIDDEN);
    expect(result.body).toStrictEqual(JSON.stringify({ message: "Forbidden" }));
  });

  it("ValidationException", async () => {
    const testHttpMethod = httpHandler(async () => {
      throw new ValidationException([
        {
          property: "test",
          value: "a",
          constraints: {
            length: ["Must be longer than 2 characters"],
          },
          target: {
            test: "a",
          },
        },
      ]);
    });

    const result = await testHttpMethod(createMockAPIGatewayEvent({}), context);

    expect(result.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(JSON.parse(result.body)).toStrictEqual({
      data: [
        {
          property: "test",
          value: "a",
          constraints: {
            length: ["Must be longer than 2 characters"],
          },
          target: {
            test: "a",
          },
        },
      ],
      message: "Validation Errors",
    });
  });
});
