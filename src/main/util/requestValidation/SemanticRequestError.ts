import { ChainableError } from "../ChainableError";

export class SemanticRequestError extends ChainableError {
    public constructor(message: string) {
        super(message, null);
    }
}
