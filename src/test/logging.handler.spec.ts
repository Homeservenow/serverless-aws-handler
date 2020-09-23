import { createLoggingHandler, LoggerFunction } from "../http/logging.handler";
import {
  HttpStatusCode,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "..";

describe("Logging Handling", () => {
  describe("With conosle", () => {
    let handler: LoggerFunction;
    beforeEach(() => {
      global.console = {
        ...global.console,
        warn: jest.fn(),
        log: jest.fn(),
        error: jest.fn(),
      };
      handler = createLoggingHandler();
    });

    describe("Boolean", () => {
      it("True", () => {
        handler(true, new Error());
        expect(global.console.log).toHaveBeenCalled();
      });

      it("False", () => {
        handler(false, new Error());
        expect(global.console.log).not.toHaveBeenCalled();
      });
    });

    describe("Range", () => {
      it("Inside range", () => {
        handler(
          [HttpStatusCode.BAD_REQUEST, HttpStatusCode.INTERNAL_SERVER_ERROR],
          new UnauthorizedException(),
        );
        expect(global.console.log).toHaveBeenCalled();
      });

      it("On range", () => {
        handler(
          [HttpStatusCode.BAD_REQUEST, HttpStatusCode.INTERNAL_SERVER_ERROR],
          new BadRequestException(),
        );
        expect(global.console.log).toHaveBeenCalled();
      });

      it("Outside Range", () => {
        handler(
          [
            HttpStatusCode.UNPROCESSABLE_ENTITY,
            HttpStatusCode.INTERNAL_SERVER_ERROR,
          ],
          new BadRequestException(),
        );
        expect(global.console.log).not.toHaveBeenCalled();
      });
    });

    describe("Whitelist", () => {
      it("Inside Whitelist", () => {
        handler(
          {
            whitelist: [
              HttpStatusCode.BAD_REQUEST,
              HttpStatusCode.UNAUTHORIZED,
            ],
          },
          new BadRequestException(),
        );
        expect(global.console.log).toHaveBeenCalled();
      });

      it("Is Not Inside Blacklist", () => {
        handler(
          {
            blacklist: [
              HttpStatusCode.BAD_REQUEST,
              HttpStatusCode.UNPROCESSABLE_ENTITY,
            ],
          },
          new UnauthorizedException(),
        );
        expect(global.console.log).toHaveBeenCalled();
      });

      it("not Inside Whitelist", () => {
        handler(
          {
            whitelist: [
              HttpStatusCode.UNPROCESSABLE_ENTITY,
              HttpStatusCode.INTERNAL_SERVER_ERROR,
            ],
          },
          new BadRequestException(),
        );
        expect(global.console.log).not.toHaveBeenCalled();
      });

      it("Is Inside Blacklist", () => {
        handler(
          {
            blacklist: [
              HttpStatusCode.UNPROCESSABLE_ENTITY,
              HttpStatusCode.BAD_REQUEST,
            ],
          },
          new BadRequestException(),
        );
        expect(global.console.log).not.toHaveBeenCalled();
      });
    });
    describe("number", () => {
      it("Is the same", () => {
        handler(HttpStatusCode.NOT_FOUND, new NotFoundException());
        expect(global.console.log).toHaveBeenCalled();
      });

      it("Not the same", () => {
        handler(HttpStatusCode.INTERNAL_SERVER_ERROR, new NotFoundException());
        expect(global.console.log).not.toHaveBeenCalled();
      });
    });
  });
});
