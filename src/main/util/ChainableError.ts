export class ChainableError extends Error {
    public constructor(
        message: string,
        private cause: Error = null,
    ) {
        super(message);

        // This ensures that the "message" property gets printed when errors are logged to Cloudwatch.
        Object.defineProperty(this, "message", {enumerable: true});

        if (cause) {
            Object.defineProperty(cause, "message", {enumerable: true});
        } else {
            Object.defineProperty(this, "cause", {enumerable: false});
        }
    }
}
