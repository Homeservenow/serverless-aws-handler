## AWS Lambda generic handling for http

<a href="https://travis-ci.org/github/Homeservenow/severless-http-handler"><img src="https://api.travis-ci.org/Homeservenow/severless-http-handler.svg?branch=master" alt="travis"/></a>
<a href='https://coveralls.io/github/Homeservenow/severless-http-handler?branch=master'><img src='https://coveralls.io/repos/github/Homeservenow/severless-http-handler/badge.svg?branch=master' alt='Coverage Status' /></a>

Generic http handling wrapper function. 

## Install 

```bash
$ yarn add @homeservenow/serverless-aws-handler
```

#### Features
 - Error logging
 - Error handling - throwable exceptions that correspond to status codes
 - Payload serialisation
 - Strong types :muscle:
 
 ## Usage

 ```typescript
import {httpHandler, NotFoundException} from '@homeservenow/serverless-aws-handler';
import {APIGatewayEvent} from 'aws-lambda';
import {database} from './database';

export const getCatHandler = httpHandler(async (event: APIGatewayEvent): Promise<CatInterface> => {
    const cat = await database().findById(event?.pathParameters.id);

    if (!cat) {
        throw new NotFoundException();
    }

    return cat;
});
 ```

 The above will result in either a 200 status code
 ```JSON
 {
     "breed": "Tabby",
     "lives": 7,
     "name": "bob"
 }
```

Or if `NotFoundException` is thrown, a 404 status code (because of NotFoundException)

```JSON
{
    "message": "Not Found"
}
```

#### Post method example

You'll notice in this example, we're returning validation errors!

```typescript
import {httpHandler, NotFoundException, BadRequestException} from '@homeservenow/serverless-aws-handler';
import {APIGatewayEvent} from 'aws-lambda';
import {database} from './database';

export const createCatHandler = httpHandler<Partial<CatInterface>>(async (
        event: APIGatewayJsonEvent<Partial<CatInterface>>,
    ): Promise<CatInterface | never> => {

    const payload = event.json;

    const validationErrors = {};

    (["breed", "name", "lives"] as (keyof CatInterface)[]).forEach((property) => {
        if (!payload[property]) {
            validationErrors[property] = 'Cannot be blank!';
        }
    });

    if (Object.keys(validationErrors).length >= 1) {
        throw new BadRequestException('Validaiton Errors', validationErrors);
    }

    return database().create(payload);
});
```
If validation errors occur then the handler will return a 400 status code plus the below body

```JSON
{
    "message": "Validation Errors",
    "data": {
        "name": "Cannot be blank!"
    }
}
```

## Available HTTP exceptions

Exception name | status code | default message
---|---|---
`BadRequestException` | 400 | Bad Request
`UnauthorizedException` | 401 | Unauthorized
`ForbiddenException` | 403 | Forbidden
`NotFoundException` | 404 | Not Found
`UnProcessableEntityException` | 422 | 'Unprocessable Entity
`InternalServerError` | 500 | Internal Server Error

## Future goals! 

> This is currently in development! 

Customable overrides of all methods provided by httpHandler. This includes 

- Error Handling
- Payload in/out serialisation
- Logging

This is the proposed structure

```typescript
export const myHandler = httpHandler({
    handler: myHandlerMethod,
    logging: (error: Error) => console.log(error),
    errorHandler: (error: Error) => {
        return {
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            body: "Please contact us that this error has occurred (code: 345)",
        };
    },
    serialise: {
        input: (event: APIGatewayEvent): void => {
            if (!event.body) {
                throw new BadRequestException('No body provided');
            }
            try {
                event.json = JSON.parse(event.body);
            } catch (e) {
                throw new BadRequestException('Malformed JSON');
            }

            return event;
        },
        output: (value: any): ApiGatewayResponse => {
            // TODO figure this function input out types
        },
    },
});
```
> Under development!
