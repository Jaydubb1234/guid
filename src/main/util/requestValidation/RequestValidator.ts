import { SyntacticRequestError } from "./SyntacticRequestError";

export class RequestValidator {

    public constructor(
        private ajv: any,
        private schema: any,
    ) { }

    public validatePayload(payload: any): void {
        this.validateAgainstSchema(payload);
    }

    protected validateAgainstSchema(payload: any): void {
        if (!this.ajv.validate(this.schema, payload)) {
            throw new SyntacticRequestError(this.ajv.errorsText());
        }
    }

}
