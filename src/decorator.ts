import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { createDecoratorOptions } from "./http.handler.options";
import { HttpHandlerDecoratorOptions } from "./interfaces";

export const HttpHandlerDecorator = <ResponseType>(
  options?: HttpHandlerDecoratorOptions<ResponseType>,
): MethodDecorator => (
  target: Object,
  key: string | Symbol,
  descriptor: PropertyDescriptor,
) => {
  const originalHandler = descriptor.value;
  const fullOptions = createDecoratorOptions<ResponseType>(options);
  const newHandler: APIGatewayProxyHandler = async (
    event,
    context
  ): Promise<APIGatewayProxyResult> => {
    try {
      const result = await originalHandler(event, context);
      return result;
    } catch (error) {
      fullOptions.logger(
        fullOptions.loggingOptions,
        error,
      );
      return fullOptions.errorHandler(error)
    }
  }

  descriptor.value = newHandler;
};
