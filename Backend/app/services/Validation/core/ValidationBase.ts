import {ValidationError} from "./ValidationError";

export class ValidationBase {
    protected errors: ValidationError[];

    protected resetErrors(): void {
        this.errors = [];
    }

    protected addError(description: string) {
        this.errors.push(new ValidationError(description));
    }
}
