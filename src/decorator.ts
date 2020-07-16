import { httpHandler } from "./http.handler";
import { HttpHandlerOptions } from "./interfaces";

export const HttpHandlerDecorator = <ResponseType>(
  options: HttpHandlerOptions<ResponseType>,
): MethodDecorator => (
  target: Object,
  key: string | Symbol,
  descriptor: PropertyDescriptor,
) => {
  const originalValue = descriptor.value;

  descriptor.value = httpHandler({
    ...options,
    handler: originalValue,
  });
};
