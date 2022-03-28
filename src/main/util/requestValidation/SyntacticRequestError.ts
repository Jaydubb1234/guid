import { ChainableError } from "../ChainableError";

export class SyntacticRequestError extends ChainableError {
    public constructor(message: string) {
        super(message, null);
    }
}
