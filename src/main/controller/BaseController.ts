import {BAD_REQUEST, INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY} from "http-status";
import {SyntacticRequestError} from "../util/requestValidation/SyntacticRequestError";
import {SemanticRequestError} from "../util/requestValidation/SemanticRequestError";
import {Response} from "../lib/Response";

export abstract class BaseController {
    public static readonly EMPTY_RESPONSE_BODY: object = {};

    public getPathParam(event: any, paramName: string): string {
        if (event.pathParameters && event.pathParameters[paramName]) {
            return event.pathParameters[paramName];
        }

        return null;
    }

    public getQueryStringParameters(event: any, paramName: string): string {
        if (event.queryStringParameters && event.queryStringParameters[paramName]) {
            return event.queryStringParameters[paramName];
        }

        return null;
    }

    public getHeader(event: any, headerName: string): string {
        if (event.headers && event.headers[headerName]) {
            return event.headers[headerName];
        }

        for (const key in event.headers) {
            if (event.headers.hasOwnProperty(key) && key.toLowerCase() === headerName.toLowerCase()) {
                return event.headers[key];
            }
        }

        return null;
    }

    protected generateResponse(requestState: string, message?: string): any {
        const response: any = {
            status: requestState,
        };

        if (typeof message !== "undefined") {
            response.message = message;
        }

        return response;
    }

    protected getNonWellFormedJsonErrorResponse(e: SyntaxError): Response {
        return new Response(
            BAD_REQUEST,
            {},
            {
                message: `payload is not well-formed JSON: \'${e.message}\'`,
                status: "error",
            },
        );
    }

    protected handleError(e: any) {
        let responseCode: number;

        if (e instanceof SyntaxError) {
            return Promise.resolve(this.getNonWellFormedJsonErrorResponse(e));
        } else if (e instanceof SyntacticRequestError) {
            responseCode = BAD_REQUEST;
        } else if (e instanceof SemanticRequestError) {
            responseCode = UNPROCESSABLE_ENTITY;
        } else {
            responseCode = INTERNAL_SERVER_ERROR;
        }

        const responseBody: any = this.generateResponse("error");
        responseBody.message = e.message;
        return new Response(responseCode, {}, responseBody);
    }
}
