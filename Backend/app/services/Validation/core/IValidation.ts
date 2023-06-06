import {ValidationError} from "./ValidationError";

export interface IValidation {
    validate(object: Object): ValidationError[];
}
